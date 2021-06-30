<template>
    <div>
        <div v-if="!loaded">
            <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
        </div>
        <div v-else>
            <div v-if="user === null || !user.emailVerified" class="h5 text-center m-3">
                ログインしていません
            </div>
            <div v-else>
                <div v-if="!response && !error">
                    <vue-loading class="my-3" type="spin" color="#007bff" :size="{width: '50px', height: '50px'}"></vue-loading>
                </div>
                <div v-if="response">
                    <NotFound v-if="notfound"></NotFound>
                    <div v-else>
                        <div v-if="owner && owner != user.uid" class="h5 text-center m-3">
                            権限がありません
                        </div>
                        <div v-else>
                            <div class="px-3 pt-2 border-bottom border-2">
                                <div class="row">
                                    <div class="form-group col-6 my-auto">
                                        <input class="form-control h2" v-model="title" placeholder="タイトルを入力">
                                    </div>
                                    <div class="col"></div>
                                    <div class="h1 col-auto mt-1 mx-2" v-if="saving">
                                        <b-icon-hourglass-split variant="secondary"></b-icon-hourglass-split>
                                    </div>
                                    <div class="h1 col-auto mt-1 mx-2" style="cursor: pointer;" v-else @click="saveData()">
                                        <b-icon-cloud-arrow-up></b-icon-cloud-arrow-up>
                                    </div>
                                </div>
                            </div>
                            <b-tabs nav-class="px-3 mt-2" justified lazy>
                                <b-tab title="メイン">
                                    <div class="card m-3 border-2 border-secondary col-md-6 mx-md-auto" v-for="i in 61" :key="i">
                                        <div class="card-title text-center h5 my-2">
                                            {{ getDateStrWithDay(i - 11) }}
                                        </div>
                                        <div class="form-group m-3 px-1">
                                            <b-form-select class="form-select" v-model="selectedTmpl[getDateStr(i - 11)]" @change="tmplSelected(getDateStr(i - 11))">
                                                <b-form-select-option :value="undefined">テンプレートから入力</b-form-select-option>
                                                <b-form-select-option v-for="tmpl in template" :key="tmpl.id" :value="tmpl.id">{{ tmpl.name }}</b-form-select-option>
                                            </b-form-select>
                                        </div>
                                        <div v-for="item in main_data[getDateStr(i - 11)]" :key="item.id" class="row mx-3 my-2">
                                            <div class="form-group col-6 px-1" :key="'1-' + fakeKey">
                                                <input class="form-control" v-model="item.item_name">
                                            </div>
                                            <div class="form-group col-6 px-1" :key="'2-' + fakeKey">
                                                <input class="form-control" v-model="item.item">
                                            </div>
                                        </div>
                                    </div>
                                </b-tab>
                                <b-tab title="テンプレート">
                                    <div class="card m-3 border-2 border-secondary col-md-6 mx-md-auto" v-for="tmpl in template" :key="tmpl.id">
                                        <div class="card-title text-center my-2">
                                            <div class="form-group col-6 mx-auto text-center">
                                                <input v-model="tmpl.name" class="form-control text-center">
                                            </div>
                                        </div>
                                        <div v-for="item in tmpl.items" :key="item.id" class="row mx-3 my-2">
                                            <div class="form-group col-6 px-1">
                                                <input class="form-control" v-model="item.item_name">
                                            </div>
                                            <div class="form-group col-6 px-1">
                                                <input class="form-control" v-model="item.item">
                                            </div>
                                        </div>
                                    </div>
                                    <div class="row m-3 m-md-0">
                                        <div class="border border-success rounded-1 text-success text-center col-md-6 mx-md-auto py-2" @click="appendTmpl()" style="cursor: pointer;">+ 追加</div>
                                    </div>
                                </b-tab>
                            </b-tabs>
                        </div>
                    </div>
                </div>
                <div v-if="error" class="alert alert-danger" role="alert">
                    エラーが発生しました。もう一度お試しください。
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";
import firebase from 'firebase'
import { VueLoading } from 'vue-loading-template'
import NotFound from '@/components/NotFound.vue'

export default {
  name: 'Edit',
  mounted () {
    firebase.auth().onAuthStateChanged((user)=> {
      this.loaded = true;
      this.user = user;
    });
    axios
      .get('https://timedule.herokuapp.com/table/' + this.$route.params.id)
      .then((response) => {
        this.owner = response.data.owner;
        this.title  = response.data.title;
        for (let i = -10; i <= 50; i++) {
          let obj = {};
          let datestr = this.getDateStr(i);
          obj[datestr] = response.data.main_data[datestr];
          if (obj[datestr] == undefined) {
            obj[datestr] = [];
          }
          let list = [];
          for (let j = 0; j < 10; j++) {
            if (obj[datestr][j]) {
              list[j] = obj[datestr][j];
            } else {
              list[j] = {
                id: String(j + 1),
                item_name: '',
                item: '',
              }
            }
          }
          Object.assign(obj[datestr], list);
          Object.assign(this.main_data, obj);
          Object.assign(this.main_data_org, obj);
        }
        this.template = response.data.template;
        this.response = true;
        document.title = this.title + 'を編集中 - Timedule';
      })
      .catch((reason) => {
        if (reason.response.status == 404) {
          this.response = true;
          this.notfound = true;
        } else {
          this.error = true;
        }
        console.log(reason.message)
      });
  },
  components: {
    NotFound,
    VueLoading,
  },
  methods: {
    getDateStr (a) {
      let d = new Date(this.today.toString());
      d.setDate(d.getDate() + a);
      let datestr = String(d.getFullYear()).slice(-2) + '/' + String(d.getMonth() + 101).slice(-2) + '/' + String(d.getDate() + 100).slice(-2);
      return datestr;
    },
    getDateStrWithDay (a) {
      let d = new Date(this.today.toString());
      d.setDate(d.getDate() + a);
      let datestr = String(d.getFullYear()).slice(-2) + '/' + String(d.getMonth() + 101).slice(-2) + '/' + String(d.getDate() + 100).slice(-2);
      let dayJP = ['日', '月', '火', '水', '木', '金', '土'];
      let dswd = datestr + ' (' + dayJP[d.getDay()] + ')';
      return dswd;
    },
    appendTmpl () {
      let obj = {
        id: String(this.template.length + 1),
        name: '新しいテンプレート',
        items: [
          {
            id: '1',
            item_name: '',
            item: '',
          },
          {
            id: '2',
            item_name: '',
            item: '',
          },
          {
            id: '3',
            item_name: '',
            item: '',
          },
          {
            id: '4',
            item_name: '',
            item: '',
          },
          {
            id: '5',
            item_name: '',
            item: '',
          },
          {
            id: '6',
            item_name: '',
            item: '',
          },
          {
            id: '7',
            item_name: '',
            item: '',
          },
          {
            id: '8',
            item_name: '',
            item: '',
          },
          {
            id: '9',
            item_name: '',
            item: '',
          },
          {
            id: '10',
            item_name: '',
            item: '',
          },
        ],
      }
      this.template.push(obj);
    },
    tmplSelected (datestr) {
      let tmplId = this.selectedTmpl[datestr];
      if (tmplId == undefined) {
        this.main_data[datestr] = this.main_data_org[datestr];
      } else {
        this.template.forEach((tmpl) => {
          if (tmpl.id == tmplId) {
            this.main_data[datestr] = tmpl.items;
          }
        });
      }
      this.fakeKey++;
    },
    saveData () {
      this.saving = true;
      this.user.getIdToken(true)
        .then((idToken) => {
          axios
            .post('https://timedule.herokuapp.com/table/' + this.$route.params.id, {
              owner: idToken,
              title: this.title,
              main_data: this.main_data,
              template: this.template,
            })
            .then(() => {
              this.saving = false;
            })
            .catch(() => {
              alert('エラーが発生しました');
              this.saving = false;
            });
        })
        .catch(() => {
          alert('エラーが発生しました');
          this.saving = false;
        });
    },
  },
  data: () => ({
    user: null,
    loaded: false,
    response: false,
    notfound: false,
    today: new Date(),
    owner: '',
    title: '',
    main_data: {},
    main_data_org: {},
    template: [],
    selectedTmpl: {},
    fakeKey: 0,
    saving: false,
    error: false,
  }),
}
</script>
