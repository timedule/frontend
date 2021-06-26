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
                <input class="form-control" id="uid" placeholder="ユーザーID" v-model="uid" @keydown.enter="focusEm()">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="email">メールアドレス</label>
                <input type="email" class="form-control" id="email" placeholder="メールアドレス" v-model="email" @keydown.enter="focusPw()">
            </div>
            <div class="form-group m-3 col-md-4 mx-md-auto">
                <label for="password">パスワード</label>
                <input type="password" class="form-control" id="password" placeholder="パスワード" v-model="password" @keydown.enter="signUp()">
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
    errmsg: '',
  }),
  mounted() {
    const user = firebase.auth().currentUser;
    if (user !== null) {
      this.$router.push('/user/' + user.uid);
    }
  },
  methods: {
    focusEm() {
      document.getElementById('email').focus();
    },
    focusPw() {
      document.getElementById('password').focus();
    },
    signUp() {
      axios.post('https://timedule.herokuapp.com/create_user', {
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
                    this.$router.push('/user/' + user.uid);
                  });
              })
              .catch((error) => {
                this.errmsg = error.code;
                this.formKey += 1;
                setTimeout(() => {
                  this.errcode = '';
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
    },
  },
}
</script>
