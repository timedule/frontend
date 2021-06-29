<template>
    <div>
        <div class="text-center my-3 h5 fw-normal">
            <span class="border border-2 border-primary rounded py-1 px-2">
                {{ arg.dtext }}
            </span>
        </div>
        <div class="col-6 mx-auto h5" v-if="arg.data">
            <table class="table table-borderless col-6">
                <tbody>
                    <tr v-for="data in arg.data" :key="data.id">
                        <th>{{ data.item_name }}</th>
                        <td class="text-center">{{ data.item }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="text-center my-3 h4" v-else>
            データがありません
        </div>
    </div>
</template>

<script>
export default {
  name: 'View-table',
  props: ['arg'],
}
</script>
