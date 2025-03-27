<template>
  <div class="register-wrapper">
    <div class="register-container">
      <h2>Đăng Ký</h2>
      <form @submit.prevent="handleRegister">
        <div class="input-group">
          <input
            v-model="username"
            type="text"
            placeholder="Tên đăng nhập"
            required
          />
        </div>
        <div class="input-group">
          <input
            v-model="password"
            type="password"
            placeholder="Mật khẩu"
            required
          />
        </div>
        <button type="submit" class="register-btn">Đăng ký</button>
        <p v-if="message" class="success">{{ message }}</p>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>

      <!-- Nút quay lại trang Đăng nhập -->
      <div class="login-link">
        <span>Đã có tài khoản?</span>
        <router-link to="/login" class="login-btn">Đăng nhập</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { ref } from "vue";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const message = ref("");
    const errorMessage = ref("");

    const handleRegister = async () => {
      try {
        await AuthService.register(username.value, password.value, "staff");
        message.value = "Đăng ký thành công! Hãy đăng nhập.";
        errorMessage.value = "";
      } catch (error) {
        errorMessage.value = "Đăng ký thất bại!";
        message.value = "";
      }
    };

    return { username, password, message, errorMessage, handleRegister };
  },
};
</script>

<style scoped>
/* Định dạng tổng thể */
.register-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  /* background: linear-gradient(to right, #667eea, #764ba2); */
}

.register-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 350px;
  transition: transform 0.3s ease-in-out;
}

.register-container:hover {
  transform: translateY(-5px);
}

h2 {
  margin-bottom: 20px;
  color: #333;
}

/* Input styling */
.input-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  outline: none;
  transition: border 0.3s;
  font-size: 16px;
}

input:focus {
  border-color: #667eea;
}

/* Nút đăng ký */
.register-btn {
  width: 100%;
  background: #667eea;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.3s;
}

.register-btn:hover {
  background: #5a67d8;
}

/* Thông báo */
.success {
  color: green;
  margin-top: 10px;
  font-size: 14px;
}

.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* Giao diện nút quay lại đăng nhập */
.login-link {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

.login-btn {
  color: #667eea;
  font-weight: bold;
  text-decoration: none;
  padding: 8px 15px;
  border: 2px solid #667eea;
  border-radius: 6px;
  display: inline-block;
  margin-left: 5px;
  transition: all 0.3s ease-in-out;
}

.login-btn:hover {
  background: #667eea;
  color: white;
}
</style>
