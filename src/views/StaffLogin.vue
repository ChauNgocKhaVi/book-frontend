<template>
  <div class="login-wrapper">
    <div class="login-container">
      <h2>Đăng Nhập</h2>
      <form @submit.prevent="handleLogin">
        <div class="input-group">
          <input v-model="username" type="text" placeholder="Tên đăng nhập" required />
        </div>
        <div class="input-group">
          <input v-model="password" type="password" placeholder="Mật khẩu" required />
        </div>
        <button type="submit" class="login-btn">Đăng nhập</button>
        <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
      </form>

      <!-- Nút chuyển qua trang Đăng ký -->
      <div class="register-link">
        <span>Chưa có tài khoản?</span>
        <router-link to="/register" class="register-btn">Đăng ký</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import AuthService from "@/services/auth.service";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  setup() {
    const username = ref("");
    const password = ref("");
    const errorMessage = ref("");
    const router = useRouter();

    const handleLogin = async () => {
      try {
        await AuthService.login(username.value, password.value);
        router.push("/books");
      } catch (error) {
        errorMessage.value = "Sai tài khoản hoặc mật khẩu!";
      }
    };

    return { username, password, errorMessage, handleLogin };
  },
};
</script>

<style scoped>
/* Định dạng tổng thể */
.login-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
}

.login-container {
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.2);
  text-align: center;
  width: 350px;
  transition: transform 0.3s ease-in-out;
}

.login-container:hover {
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

/* Nút đăng nhập */
.login-btn {
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

.login-btn:hover {
  background: #5a67d8;
}

/* Thông báo lỗi */
.error {
  color: red;
  margin-top: 10px;
  font-size: 14px;
}

/* Giao diện nút đăng ký */
.register-link {
  margin-top: 15px;
  font-size: 14px;
  color: #555;
}

.register-btn {
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

.register-btn:hover {
  background: #667eea;
  color: white;
}
</style>
