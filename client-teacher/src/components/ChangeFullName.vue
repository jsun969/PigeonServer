<template>
  <v-container>
    <v-row>
      <v-text-field
        v-model="newFullName"
        label="新姓名"
        outlined
        @update:error="isNewFullNameErr = $event"
        :rules="[...fullNameRules, newFullName !== userFullName || !newFullName || '与旧姓名相同']"
      ></v-text-field>
    </v-row>
    <v-row align="center" justify="center">
      <v-btn
        large
        color="primary"
        :block="$vuetify.breakpoint.name === 'xs'"
        :disabled="!newFullName || newFullNameErr"
        @click="changeFullName"
        >确定
      </v-btn>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapMutations } from 'vuex';

export default {
  name: 'ChangeFullName',
  data: () => ({
    newFullName: '',
    isNewPwdErr: false,
    newFullNameErr: false,
    fullNameRules: [
      value => (value || '').length <= 20 || !value || '最多20个字符',
      value => (value || '').length >= 2 || !value || '至少2个字符',
      value => {
        // 支持中文名(包括少数民族)
        const pattern = /^[\u4E00-\u9FA5]+(·[\u4E00-\u9FA5]+)*$/;
        return pattern.test(value) || !value || '姓名无效';
      },
    ],
  }),
  methods: {
    async changeFullName() {
      // 待做:确认是否修改姓名
      this.$socket.client.emit('changeFullName', { auth: localStorage.getItem('userToken'), newFullName: this.newFullName });
      this.setNewFullNameWhenChange({ fullName: this.newFullName });
      this.showDialog({ value: 'ChangeFullNameSuccess', style: 0, text: '修改姓名成功' });
      this.newFullName = '';
    },
    ...mapMutations(['showDialog', 'setNewFullNameWhenChange']),
  },
  computed: {
    ...mapState(['userFullName']),
  },
};
</script>
