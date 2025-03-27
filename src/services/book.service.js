import createApiClient from "./api.service";

class BookService {
    constructor(baseUrl = "/api/books") {
        this.api = createApiClient(baseUrl);
    }
    async getAll() {
        return (await this.api.get("/")).data;
    }
    async create(data) {
        return (await this.api.post("/", data)).data;
    }
    async deleteAll() {
        return (await this.api.delete("/")).data;
    }
    async get(id) {
        return (await this.api.get(`/${id}`)).data;
    }
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }
    async borrowBook(id) {
        try {
            const response = await this.api.put(`/borrow/${id}`);
            return response.data;
        } catch (error) {
            console.error("Lỗi khi mượn sách:", error);
            throw error; // Ném lỗi ra ngoài
        }
    }
    async returnBook(bookId) {
        return await this.api.patch(`/${bookId}/returnBook`);
    }


}

export default new BookService();