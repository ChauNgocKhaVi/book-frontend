<template>
    <div class="page container">
        <h2 class="text-center">Quản lý việc mượn sách</h2>        
        <div class="row mt-3">
            <div class="col-md-12">
                <InputSearch v-model="searchText" />
            </div>
        </div>
        
        <div class="row mt-3 align-items-center">
            <div class="col-md-6">
                <h4>Danh sách người mượn <i class="fas fa-book-reader"></i></h4>
            </div>
            <div class="col-md-6 text-right">
                <button class="btn btn-sm btn-success" @click="goToAddBorrow">
                    <i class="fas fa-plus"></i> Thêm mới
                </button>
            </div>
        </div>

        <div class="row mt-3">
            <div class="col-md-12">
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
                                <button class="btn btn-sm btn-warning mr-2" @click="goToEditBorrow(borrow._id)"><i class="fas fa-edit"></i></button>
                                <button class="btn btn-sm btn-danger" @click="removeBorrow(borrow._id)"><i class="fas fa-trash"></i></button>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="filteredBorrowsCount === 0">Không có người mượn nào.</p>
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
            books: [],
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
        filteredBorrows() {
            return this.borrows.map(borrow => ({
                ...borrow,
                HoTen: this.getReaderName(borrow.MaDocGia),
                TenSach: this.getBookName(borrow.MaSach),
                isOverdue: this.isOverdue(borrow.NgayTra),
            })).filter(borrow => {
                const searchString = `${borrow.HoTen} ${borrow.TenSach} ${borrow.NgayMuon} ${borrow.NgayTra}`;
                return searchString.toLowerCase().includes(this.searchText.toLowerCase());
            });
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
        getReaderName(maDocGia) {
            const reader = this.readers.find(r => r._id === maDocGia);
            return reader ? `${reader.HoLot} ${reader.Ten}` : "Không xác định";
        },
        async retrieveReaders() {
            try {
                this.readers = await ReaderService.getAll();
            } catch (error) {
                console.error("Lỗi khi tải danh sách độc giả:", error);
            }
        },
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
        async removeBorrow(borrowId) {
            if (confirm("Bạn muốn xóa người mượn này?")) {
                try {
                    const borrow = this.borrows.find(b => b._id === borrowId);
                    if (!borrow) {
                        alert("Không tìm thấy lượt mượn!");
                        return;
                    }
                    await BorrowService.delete(borrowId);
                    if (borrow.MaSach) {
                        await BookService.returnBook(borrow.MaSach);
                    }
                    this.refreshList();
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
        isOverdue(NgayTra) {
            return new Date(NgayTra) < new Date();
        },
    },
    mounted() {
        this.refreshList();
        this.retrieveBooks();
        this.retrieveReaders();
        this.retrieveBorrows();
        // Kiểm tra nếu có query reload thì load lại danh sách
        if (this.$route.query.reload) {
            this.retrieveBorrows();
        }
    },
};
</script>

<style scoped>
.table-danger {
    background-color: #f8d7da;
}
.page {
    text-align: left;
    max-width: 1000px;
    margin: auto;
}
</style>
