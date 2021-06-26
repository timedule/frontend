<template>
    <div>
        <div class="p-3 border-bottom border-2">
            <span class="h2">
                ユーザー設定
            </span>
        </div>
        <div>
            <div class="d-grid col-12 p-3 col-md-4 mx-auto">
                <div class="btn btn-outline-primary" @click="logOut()">
                    ログアウト
                </div>
            </div>
            <transition>
                <div v-if="errcode" class="alert alert-danger m-3" role="alert">
                    エラーが発生しました。エラーコード: {{ this.errcode }}
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

export default {
  name: 'User-settings',
  mounted () {
    this.user = firebase.auth().currentUser;
    if (this.user === null || this.user.uid != this.$route.params.user_id) {
      this.$router.push('/user/' + this.$route.params.user_id);
    }
  },
  methods: {
    logOut() {
      firebase.auth().signOut()
        .then(() => {
          this.$router.push('/user/' + this.$route.params.user_id);
        })
        .catch((error) => {
          this.errcode = error.code;
          this.formKey += 1;
          setTimeout(() => {
            this.errcode = '';
          }, 2000);
        });
    },
  },
  data: () => ({
    user: null,
    errcode: '',
  }),
}
</script>
