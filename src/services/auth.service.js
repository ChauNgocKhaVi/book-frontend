import createApiClient from "./api.service";
import { reactive } from "vue";

class AuthService {
    constructor(baseUrl = "/api/auth") {
        this.api = createApiClient(baseUrl);
        this.state = reactive({
            user: JSON.parse(localStorage.getItem("user")) || null,
        });
    }

    async login(username, password) {
        try {
            console.log("Đang gửi yêu cầu đăng nhập...");
            const response = await this.api.post("/login", { username, password });
            console.log("Phản hồi từ server:", response.data);

            if (!response.data.token) {
                throw new Error("Không nhận được token từ server!");
            }

            localStorage.setItem("user", JSON.stringify(response.data));
            this.state.user = response.data; // Cập nhật state reactive
            return response.data;
        } catch (error) {
            console.error("Lỗi đăng nhập:", error.response?.data || error.message);
            throw error;
        }
    }

    async register(username, password, role) {
        return await this.api.post("/register", { username, password, role });
    }

    logout() {
        localStorage.removeItem("user");
        this.state.user = null; // Cập nhật state reactive
    }

    getCurrentUser() {
        return this.state.user;
    }
}

// Xuất AuthService dưới dạng instance
export default new AuthService();
