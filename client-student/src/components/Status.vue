<template>
  <v-container>
    <v-row>
      <v-col cols="12" class="mt-4">
        <v-card>
          <v-card-title>设备代码</v-card-title>
          <v-card-text class="display-4">
            {{ code }}
          </v-card-text>
          <!-- <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn rounded outlined text> 刷新 <v-icon dark> mdi-reload </v-icon> </v-btn>
          </v-card-actions> -->
        </v-card>
      </v-col>
      <v-col cols="4">
        <v-card>
          <v-card-title>累计消息</v-card-title>
          <v-card-text>
            <span class="display-2">{{ messagesCnt }}</span>
            <span class="title">条</span>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="8">
        <v-card>
          <v-list-item two-line>
            <v-list-item-content>
              <v-list-item-title class="title ">
                关于
              </v-list-item-title>
              <div class="d-flex flex-column body-2 mt-2">
                <span>作者:<a @click="blog">荆棘Justin</a></span>
                <span>项目已在<a @click="github">Github</a>开源</span>
                <span>欢迎Star&Fork</span>
                <span>如遇到问题可Issue</span>
                <span>作者邮箱<a href="mailto:i@jsun969.cn">i@jsun969.cn</a></span>
              </div>
            </v-list-item-content>
            <v-list-item-avatar tile size="80">
              <img src="../assets/avatar.png" alt="avatar" />
            </v-list-item-avatar>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
import { mapState, mapGetters } from 'vuex';
import { shell } from 'electron';

export default {
  name: 'Status',
  methods: {
    blog() {
      shell.openExternal('https://jsun969.cn');
    },
    github() {
      shell.openExternal('https://github.com/jsun969/Pigeon');
    },
  },
  computed: {
    ...mapState(['code']),
    ...mapGetters(['messagesCnt']),
  },
};
</script>
