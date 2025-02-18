<template>
  <v-app>
    <v-navigation-drawer v-if="$vuetify.breakpoint.name !== 'xs' && isLogin" app clipped :mini-variant="drawer" permanent>
      <v-list :shaped="!drawer">
        <v-list-item link v-for="(item, index) in navItems" :key="index" :to="item.to" color="primary">
          <v-list-item-icon>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-title>{{ item.text }}</v-list-item-title>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div class="pa-2">
          <v-btn icon v-if="drawer" @click="showDialog({ value: 'Logout', style: 2, text: '确定退出当前帐号?' })">
            <v-icon>mdi-logout</v-icon>
          </v-btn>
          <v-btn block color="primary" v-else @click="showDialog({ value: 'Logout', style: 2, text: '确定退出当前帐号?' })">
            <v-icon left>mdi-logout</v-icon>
            退出登录
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>
    <v-app-bar app color="primary" dark clipped-left>
      <v-app-bar-nav-icon @click="drawer = !drawer" v-if="$vuetify.breakpoint.name !== 'xs' && isLogin"></v-app-bar-nav-icon>
      <v-toolbar-title>飞鸽传书</v-toolbar-title>
      <v-btn icon @click="github" class="ml-5">
        <v-icon>mdi-github</v-icon>
      </v-btn>
      <v-spacer></v-spacer>
      <span v-if="isLogin">欢迎您 , {{ userFullName }}老师</span>
      <v-btn
        icon
        @click="showDialog({ value: 'Logout', style: 2, text: '确定退出当前帐号?' })"
        class="ml-5"
        v-if="$vuetify.breakpoint.name === 'xs' && isLogin"
      >
        <v-icon>mdi-logout</v-icon>
      </v-btn>
      <template v-slot:extension v-if="$vuetify.breakpoint.name === 'xs' && $route.name === 'Setting'">
        <v-tabs v-model="tabs" show-arrows>
          <v-tab v-for="(item, index) in settings.tabItems" :key="index">
            <v-icon left>
              {{ item.icon }}
            </v-icon>
            {{ item.text }}
          </v-tab>
        </v-tabs>
      </template>
    </v-app-bar>
    <UserAuth v-if="isLogin !== null && !isLogin" />
    <v-main v-if="isLogin !== null && isLogin">
      <router-view />
      <v-bottom-navigation fixed v-model="btmNav" color="primary" grow v-if="$vuetify.breakpoint.name === 'xs'">
        <v-btn v-for="(item, i) in navItems" :key="i" :to="item.to" :value="item.value">
          <span>{{ item.text }}</span>
          <v-icon>{{ item.icon }}</v-icon>
        </v-btn>
      </v-bottom-navigation>
    </v-main>
    <Dialog
      :showDialog="dialog.open"
      :mainText="dialog.text"
      :titleStyle="dialog.style"
      @close="closeDialog"
      @confirmClose="confirmCloseDialog"
      @refuseClose="refuseCloseDialog"
    />
  </v-app>
</template>

<script>
import { mapMutations, mapState } from 'vuex';
import UserAuth from './components/UserAuth';
import Dialog from './components/Dialog';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    UserAuth,
    Dialog,
  },
  async mounted() {
    if (localStorage.getItem('userToken')) {
      try {
        const {
          status,
          data: { fullName, messages },
        } = (await axios.post('/user/token-verify', { auth: localStorage.getItem('userToken') })) || {};
        if (status === 200) {
          this.userLogin({ value: true });
          axios.defaults.headers.common['auth'] = localStorage.getItem('userToken');
          this.setFullName({ fullName });
          this.setMessages({ messages });
          this.getAllDevices();
        }
      } catch (error) {
        this.userLogin({ value: false });
        return;
      }
    } else {
      this.userLogin({ value: false });
    }
  },
  sockets: {
    connect() {
      if (localStorage.getItem('userToken')) {
        this.$socket.client.emit('userCreated', { auth: localStorage.getItem('userToken') });
      }
    },
  },
  data: () => ({
    drawer: false,
    navItems: [
      { to: '/', text: '发送信息', icon: 'mdi-email-send', value: 'Home' },
      { to: '/history', text: '历史记录', icon: 'mdi-history', value: 'History' },
      { to: '/add', text: '添加设备', icon: 'mdi-cellphone-link', value: 'Add' },
      { to: '/setting', text: '个人设置', icon: 'mdi-account-cog', value: 'Setting' },
    ],
  }),
  methods: {
    github() {
      window.open('https://github.com/jsun969/Pigeon');
    },
    closeDialog() {
      this.hideDialog();
      const { value } = this.dialog;
      if (value === 'LoginSuccess') {
        this.userLogin({ value: true });
      } else if (value === 'ChangeFullNameSuccess') {
        this.setFullName({ fullName: this.newFullNameWhenChange });
      }
    },
    confirmCloseDialog() {
      this.hideDialog();
      const { value } = this.dialog;
      if (value === 'Logout') {
        localStorage.removeItem('userToken');
        this.userLogin({ value: false });
        this.$router.push({ name: 'Home' });
      } else if (value.name === 'removeDevice') {
        this.$socket.client.emit('removeDevice', { auth: localStorage.getItem('userToken'), code: value.code });
        this.removeDevice({ code: value.code });
      }
    },
    refuseCloseDialog() {
      this.hideDialog();
    },
    ...mapMutations([
      'hideDialog',
      'userLogin',
      'setFullName',
      'removeDevice',
      'getAllDevices',
      'showDialog',
      'updateSettingsTabs',
      'getAllDevices',
      'setMessages',
    ]),
  },
  computed: {
    btmNav() {
      return this.$route.name;
    },
    tabs: {
      get() {
        return this.settings.tabs;
      },
      set(value) {
        this.updateSettingsTabs(value);
      },
    },
    ...mapState(['isLogin', 'userFullName', 'dialog', 'newFullNameWhenChange', 'settings']),
  },
};
</script>
