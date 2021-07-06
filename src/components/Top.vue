<template>
    <div class="mx-auto col-md-8">
        <img src="@/assets/top.png" class="w-100">
        <div class="m-3">
            <p>Timeduleでは、誰でも簡単に自分専用の時間割を作成して、インターネットで閲覧することができるようになります。</p>
            <h3 class="fw-bold"># 使い道は無限大</h3>
            <p>例えば、あなたが自分のクラスの時間割をTimeduleで作成して、クラスのグルチャにリンクを貼れば、秒で人気者になれるかもしれません。</p>
            <p>結構需要あります。(体験談)</p>
            <p>他にも、行事などで変則的な日程になっても、Timeduleは一日ごとに予定を入力するので、対応できます。</p>
            <p>自分だけで使ってももちろん便利なはずです！</p>
            <h3 class="fw-bold"># 便利な機能アリ</h3>
            <p>Timeduleは一日ごとに予定を入力する方式ですが、「A週の○曜日はこの予定」のように決まった予定を入力しやすいように、テンプレート機能をつけました。</p>
            <p>予めテンプレートを作成しておけば、特別な日程の日以外は手入力しなくて済みます。</p>
            <h3 class="fw-bold"># お知らせ</h3>
            <p>Timeduleの最新情報は、Twitterで提供しています。</p>
            <div class="card m-3">
                <a class="twitter-timeline" href="https://twitter.com/timedule?ref_src=twsrc%5Etfw">Tweets by timedule</a>
            </div>
            <h3 class="fw-bold"># プライバシーについて</h3>
            <p>個人情報の保護には細心の注意をはらっています。</p>
            <p>トラブルを防ぐため、ユーザーのメールアドレスとパスワードは、外部サービスのFirebaseを使用して管理しています。</p>
            <p>プライバシーに関する詳細は、<router-link to="/privacy">プライバシーポリシー</router-link>をご覧ください。</p>
            <h3 class="fw-bold"># 製作者紹介</h3>
            <p>このサービスは、日本の高校生Laddgeが立ち上げました。</p>
            <p>こちらで活動中: <a href="https://twitter.com/laddge_" class="btn btn-primary btn-sm mx-1"><b-icon-twitter></b-icon-twitter> laddge_</a><a href="https://github.com/laddge" class="btn btn-secondary btn-sm mx-1"><b-icon-github></b-icon-github> laddge</a></p>
            <p>まだまだ勉強中なので、足りないところもあるかも知れませんが、よろしくお願いします。</p>
            <h3 class="fw-bold"># 協力者紹介</h3>
            <p>このサービスは、Laddgeが所属しているTGR Groupの協力を得て実現されています。</p>
            <p>詳しくは<a href="https://twitter.com/TGRGroup_PR">こちら</a></p>
            <h3 class="fw-bold"># ソースコード</h3>
            <p>このページに関わるソースコードは、GitHubで公開しています。</p>
            <p><a href="https://github.com/timedule" class="btn btn-secondary btn-sm mx-1"><b-icon-github></b-icon-github> timedule</a></p>
            <p>間違いなどがありましたら、遠慮なくご連絡ください。</p>
            <h3 class="fw-bold"># お問い合わせ</h3>
            <p>お問い合わせは、TwitterのDM、または以下のメールアドレスにご連絡ください。</p>
            <p>メールアドレス: laddge.timedule@gmail.com</p>
        </div>
    </div>
</template>

<script>
export default {
  name: 'Top',
  mounted() {
  setTimeout(() => {
    let tweetScript = document.createElement('script')
    tweetScript.setAttribute('src', 'https://platform.twitter.com/widgets.js')
    tweetScript.setAttribute('async', 'true')
    document.head.appendChild(tweetScript)
  }, 100)
},
}
</script>
