<template>
<div>
    <div class="p-3 border-bottom border-2">
        <span class="h2">
            ユーザー登録
        </span>
    </div>
    <div class="text-center">
        <div :key="formKey">
            <img src="@/assets/signup.png" height="150" class="my-3">
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="uid">ユーザーID</label>
                <input class="form-control" id="uid" placeholder="ユーザーID" v-model="uid" @keydown.enter="focusTo('email')">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="email">メールアドレス</label>
                <input type="email" class="form-control" id="email" placeholder="メールアドレス" v-model="email" @keydown.enter="focusTo('password')">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="password">パスワード</label>
                <input :type="pwType" class="form-control" id="password" placeholder="パスワード" v-model="password" @keydown.enter="focusTo('re_password')">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="re_password">パスワード(確認用)</label>
                <input :type="pwType" class="form-control" id="re_password" placeholder="パスワード(確認用)" v-model="re_password" @keydown.enter="signUp()">
            </div>
            <div class="form-check d-inline-block mb-3">
                <input class="form-check-input" type="checkbox" id="showPass" v-model="showPass">
                <label class="form-check-label" for="showPass">パスワードを表示</label>
            </div>
            <br>
            <div class="form-check d-inline-block mb-3">
                <input class="form-check-input" type="checkbox" id="acceptService" v-model="acceptService">
                <label class="form-check-label" for="acceptService"><router-link to="/termsofuse">利用規約</router-link>に同意する</label>
            </div>
        </div>
        <div class="btn btn-outline-primary" @click="signUp()">登録</div>
        <div class="m-3">
            <small>
                登録済みの方 ➔ <router-link to="/login">ログイン</router-link>
            </small>
        </div>
        <transition>
            <div v-if="errmsg" class="alert alert-danger m-3" role="alert">
                {{ this.errmsg }}
            </div>
        </transition>
    </div>
</div>
</template>

<style>
.v-leave-active {
    transition: opacity 1s
}
.v-leave-to {
    opacity: 0;
}
</style>

<script>
import firebase from 'firebase'
import axios from "axios";

export default {
  name: 'Signup',
  data: () => ({
    formKey: 0,
    uid: '',
    email: '',
    password: '',
    re_password: '',
    showPass: false,
    acceptService: false,
    errmsg: '',
  }),
  mounted() {
    firebase.auth().onAuthStateChanged((user)=> {
      if (user !== null) {
        this.$router.replace('/user/' + user.uid);
      }
    });
  },
  methods: {
    focusTo(id) {
      document.getElementById(id).focus();
    },
    signUp() {
      if (this.acceptService) {
        if (this.password == this.re_password) {
          axios.post('https://api.timedule.net/create_user', {
            uid: this.uid,
            email: this.email,
            password: this.password,
          })
            .then((response) => {
              if (response.data.res) {
                if (response.data.res == 'UidAlreadyExists') {
                  this.errmsg = 'ユーザーIDが存在します';
                  this.formKey += 1;
                } else if (response.data.res == 'EmailAlreadyExists') {
                  this.errmsg = 'メールアドレスが存在します';
                  this.formKey += 1;
                } else if (response.data.res == 'InvalidEmail') {
                  this.errmsg = 'メールアドレスが正しくありません';
                  this.formKey += 1;
                } else if (response.data.res == 'WeakPassword') {
                  this.errmsg = 'パスワードは6文字以上にしてください';
                  this.formKey += 1;
                } else {
                  this.errmsg = response.data.res;
                  this.formKey += 1;
                }
              } else {
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                  .then((userCredential) => {
                    let user = userCredential.user;
                    user.sendEmailVerification()
                      .then(() => {
                        this.$router.replace('/user/' + user.uid);
                      });
                  })
                  .catch((error) => {
                    this.errmsg = error.code;
                    this.formKey += 1;
                    setTimeout(() => {
                      this.errmsg = '';
                    }, 2000);
                  });
              }
            })
            .catch((reason) => {
              this.errmsg = '予期せぬエラーが発生しました';
              this.formKey += 1;
              console.log(reason.message);
              alert(reason.message);
            });
        } else {
          this.errmsg = 'パスワードが一致しません。';
          this.formKey += 1;
          setTimeout(() => {
            this.errmsg = '';
          }, 2000);
        }
      } else {
        this.errmsg = '利用規約に同意する必要があります。';
        setTimeout(() => {
          this.errmsg = '';
        }, 2000);
      }
    },
  },
  computed: {
    pwType: function () {
      if (this.showPass) {
        return 'text';
      } else {
        return 'password';
      }
    },
  },
}
</script>
