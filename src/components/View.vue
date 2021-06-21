<template>
    <div>
        <div v-if="response">
            {{ this.response }}
        </div>
        <div v-if="error" class="alert alert-danger" role="alert">
            エラーが発生しました。もう一度お試しください。
        </div>
        <NotFound v-if="!exists"></NotFound>
    </div>
</template>

<script>
import axios from "axios";
import NotFound from '@/components/NotFound.vue'

export default {
  name: 'View',
  mounted () {
    axios
      .get('https://timedule.herokuapp.com/table/' + this.$route.params.id)
      .then((response) => {
        this.response = response.data;
      })
      .catch((reason) => {
        if (reason.response.status == 404) {
          this.exists = false;
        } else {
          this.error = true;
        }
        console.log(reason.message)
      });
  },
  components: {
    NotFound,
  },
  data: () => ({
    response: null,
    exists: true,
    error: false,
  }),
}
</script>
