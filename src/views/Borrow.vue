<template>
    <div class="page container">
        <h2 class="text-center">Quản lý việc mượn sách</h2>        
        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12">
                <h4>Danh sách người mượn <i class="fas fa-book-reader"></i></h4>
                <table class="table table-bordered table-striped">
                    <thead>
                        <tr>
                            <th>Tên độc giả</th>
                            <th>Tên sách</th>
                            <th>Ngày mượn</th>
                            <th>Ngày trả</th>                            
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(borrow, index) in filteredBorrows" :key="index" :class="{ 'table-danger': borrow.isOverdue }" @click="activeIndex = index">
                            <td>{{ borrow.HoTen }}</td>                            
                            <td>{{ borrow.TenSach }}</td>
                            <td>{{ borrow.NgayMuon }}</td>
                            <td>{{ borrow.NgayTra }}</td>                            
                            <td>
                                <!-- Nút Sửa -->
                                <button class="btn btn-sm btn-warning mr-4" @click="goToEditBorrow(borrow._id)">
                                    <i class="fas fa-edit"></i>
                                </button>
                                 <!-- Nút Xóa -->
                                <button class="btn btn-sm btn-danger" @click="removeBorrow(borrow._id)">
                                    <i class="fas fa-trash"></i>
                                </button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filteredBorrowsCount === 0">Không có người mượn nào.</p>
            </div>
        </div>
        
        <div class="row mt-3">
            <div class="col-md-12 text-center">
                
                <button class="btn btn-sm btn-success mr-5" @click="goToAddBorrow">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
                <button class="btn btn-sm btn-danger" @click="removeAllBorrows">
                    <i class="fas fa-trash"></i> Xóa tất cả
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import BorrowCard from "@/components/BorrowCard.vue";
import InputSearch from "@/components/InputSearch.vue";
import BorrowService from "@/services/borrow.service";
import BookService from "@/services/book.service";
import ReaderService from "@/services/reader.service";

export default {
    components: {
        BorrowCard,
        InputSearch,
    },
    data() {
        return {
            borrows: [],
            books: [], // Danh sách sách
            readers: [],
            activeIndex: -1,
            searchText: "",
        };
    },
    watch: {
        searchText() {
            this.activeIndex = -1;
        },
    },
    computed: {
        borrowStrings() {
            return this.borrows.map((borrow) => {
                // Lấy tên độc giả từ `borrow.MaDocGia`
                const reader = this.readers.find(r => r._id === borrow.MaDocGia);
                const hoTen = reader ? `${reader.HoLot} ${reader.Ten}` : "Không xác định";

                // Lấy tên sách từ `borrow.MaSach`
                const book = this.books.find(p => p._id === borrow.MaSach);
                const tenSach = book ? book.TenSach : "Không xác định";

                // Trả về các thuộc tính của đối tượng borrow trong một chuỗi
                return [hoTen, tenSach, borrow.NgayMuon, borrow.NgayTra].join(" ");
            });
        },
        // filteredBooks() {
        //     if (!this.searchText) return this.books;  
        //     return this.books.filter((_book, index) =>
        //         this.bookStrings[index].includes(this.searchText),                
        //     );
        // },

        filteredBorrows() {
            if (!this.searchText) {
                return this.borrows.map(borrow => ({
                    ...borrow,
                    HoTen: this.getReaderName(borrow.MaDocGia), // Gán họ tên độc giả
                    TenSach: this.getBookName(borrow.MaSach), // Gán Tên NXB vào từng sách
                    isOverdue: this.isOverdue(borrow.NgayTra), // Kiểm tra quá hạn
                }));
            }
            
            return this.borrows
                .map(borrow => ({
                    ...borrow,
                    HoTen: this.getReaderName(borrow.MaDocGia),
                    TenSach: this.getBookName(borrow.MaSach),
                    isOverdue: this.isOverdue(borrow.NgayTra), // Kiểm tra quá hạn
                }))
                .filter((_borrow, index) => this.borrowStrings[index].includes(this.searchText));
        },

        filteredBorrowsCount() {
            return this.filteredBorrows.length;
        },
    },
    methods: {
        async retrieveBorrows() {
            try {
                this.borrows = await BorrowService.getAll();
            } catch (error) {
                console.log(error);
            }
        },

        // Hàm lấy tên độc giả
        getReaderName(maDocGia) {
            if (!this.readers || !Array.isArray(this.readers) || this.readers.length === 0) {
                return "Không xác định"; // Trả về mặc định nếu readers chưa có dữ liệu
            }
            const reader = this.readers.find(r => r._id === maDocGia);
            return reader ? `${reader.HoLot} ${reader.Ten}` : "Không xác định";
        },

        // Hàm Lấy danh sách của độc giả
        async retrieveReaders() {
            try {
                this.readers = await ReaderService.getAll();
            } catch (error) {
                console.error("Lỗi khi tải danh sách độc giả:", error);
            }
        },

        // Hàm Lấy danh sách của sách
        async retrieveBooks() {
            try {
                this.books = await BookService.getAll();
            } catch (error) {
                console.error("Lỗi khi tải danh sách sách:", error);
            }
        },

        getBookName(maSach) {
            const book = this.books.find(p => p._id === maSach);
            return book ? book.TenSach : "Không xác định";
        },

        refreshList() {
            this.retrieveBorrows();
            this.activeIndex = -1;
        },

        async removeAllBorrows() {
            if (confirm("Bạn muốn xóa tất cả?")) {
                try {
                    await BorrowService.deleteAll();
                    this.refreshList();
                } catch (error) {
                    console.log(error);
                }
            }
        },
        // async removeBorrow(borrowId) {
        //     if (confirm("Bạn muốn xóa người mượn này?")) {
        //         try {
        //             await BorrowService.delete(borrowId);  // Gọi API để xóa người mượn
        //             this.refreshList();  // Làm mới danh sách
        //         } catch (error) {
        //             console.error("Lỗi khi xóa người mượn:", error);
        //         }
        //     }
        // },
        async removeBorrow(borrowId) {
            if (confirm("Bạn muốn xóa người mượn này?")) {
                try {
                    // 🔥 Lấy thông tin lượt mượn trước khi xóa
                    const borrow = this.borrows.find(b => b._id === borrowId);
                    if (!borrow) {
                        alert("Không tìm thấy lượt mượn!");
                        return;
                    }

                    await BorrowService.delete(borrowId); // Xóa mượn sách

                    // 🔥 Cộng lại SoQuyen cho sách
                    if (borrow.MaSach) {
                        await BookService.returnBook(borrow.MaSach);
                    }

                    this.refreshList(); // Làm mới danh sách
                } catch (error) {
                    console.error("Lỗi khi xóa người mượn:", error);
                }
            }
        },

        goToEditBorrow(id) {
            this.$router.push({ name: "borrow.edit", params: { id } });
        },
        goToAddBorrow() {
            this.$router.push({ name: "borrow.add" });
        },

        // Kiểm tra người mượn quá hạn
        isOverdue(NgayTra) {
            const today = new Date();
            const returnDate = new Date(NgayTra);
            return returnDate < today; // Nếu ngày trả trước hôm nay, là quá hạn
        },
    },
    mounted() {
        this.refreshList();
        this.retrieveBooks(); // Gọi API để lấy danh sách NXB
        this.retrieveReaders(); // Gọi API để lấy danh sách Độc giả
    },
};
</script>

<style scoped>

.table-danger {
    background-color: #f8d7da; /* Màu nền đỏ nhạt */
}

.page {
    text-align: left;
    max-width: 1000px;
    margin: auto;
}
</style>