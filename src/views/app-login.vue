<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex class="wrapper">
        <v-card class="elevation-0">
          <v-card-title v-if="view === 'login'">
            {{ $t('auth.loginTitle') }}
          </v-card-title>
          <v-card-title v-if="view === 'reset'">
            {{ $t('auth.forgotPasswordTitle') }}
          </v-card-title>

          <v-card-text>
            <p v-if="view === 'reset'">
              {{ $t('auth.forgotPasswordDescription') }}
            </p>

            <v-form>
              <v-text-field
                name="email"
                :label="$t('auth.email')"
                type="text"
                v-model="email"
              ></v-text-field>
              <v-text-field
                v-if="view === 'login'"
                name="password"
                :label="$t('auth.password')"
                type="password"
                v-model="password"
              ></v-text-field>
            </v-form>

            <p v-if="error" class="error--text">{{ error }}</p>

            <div class="actions">
              <template v-if="view === 'login'">
                <v-btn block color="primary" @click="logIn">
                  {{ $t('auth.login') }}
                </v-btn>
                <a @click="view = 'reset'">
                  {{ $t('auth.forgotPassword') }}
                </a>
              </template>

              <template v-if="view === 'reset'">
                <v-btn block color="primary" @click="resetPassword">
                  {{ $t('auth.resetPassword') }}
                </v-btn>
                <a @click="view = 'login'">
                  {{ $t('auth.returnToLogin') }}
                </a>
              </template>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
import Vue from 'vue';

import {logIn, resetPassword} from '../libs/auth';

interface Data {
  view: 'login' | 'reset';
  email: string;
  password: string;
  error: string | null;
}

export default Vue.extend({
  data(): Data {
    return {
      view: 'login',
      email: '',
      password: '',
      error: null
    };
  },
  methods: {
    logIn() {
      this.error = null;
      logIn(this.email, this.password)
        .then(() => {
          this.$router.push('/');
        })
        .catch(error => {
          this.error = error;
        });
    },
    resetPassword() {
      this.error = null;
      resetPassword(this.email).catch(error => {
        this.error = error;
      });
    }
  }
});
</script>

<style scoped>
.wrapper {
  max-width: 26rem;
}

.actions {
  display: flex;
  flex-direction: column;
  grid-gap: 16px;
  margin-top: 16px;
  text-align: center;
}

.actions >>> a {
  font-size: 0.875rem;
  line-height: 1.3;
}
</style>
