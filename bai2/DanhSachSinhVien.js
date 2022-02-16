/**
 * Lưu trữ nhiều đối tượng sinh viên
 * => thêm, xóa, sửa, tìm kiếm
 *
 */

function DanhSachSinhVien() {
  //thuộc tính
  this.mangSV = [];

  //phương thức
  this.themSV = function (sv) {
    this.mangSV.push(sv);
  };
  //tìm vị trí được dùng cho cả xóa và cập nhật nên sẽ được tách thành phương thức để dùng chung
  //refactor : làm gọn code
  this.timViTri = function (ma) {
    var viTri = -1;
    this.mangSV.map(function (sv, index) {
      if (sv.maSV == ma) {
        //tìm thấy sinh viên
        viTri = index;
      }
    });
    return viTri;
  };
  this.xoaSV = function (ma) {
    var viTriSV = this.timViTri(ma);
    if (viTriSV > -1) {
      //tim thấy
      //xóa sv khỏi mảng
      //splice(vị trí bắt đầu xóa, số lượng phần tử cần xóa)
      // this.mangSV.splice(0,2) => xóa vị trí 0,1
      this.mangSV.splice(viTriSV, 1);
    } else {
      //không thấy
      console.log("Chức năng xóa: Không tìm thấy SV");
    }
  };

  this.capNhatSV = function (sv) {
    var viTriSV = this.timViTri(sv.maSV);
    if (viTriSV > -1) {
      //tim thấy
      //Gán giá trị mới cho sv ở vị trí tìm được
      dssv.mangSV[viTriSV] = sv;
      //array[index] : lấy giá trị ở vị trí index
      //array[index] = value: gán giá trị vào vị trí index
    } else {
      //không thấy
      console.log("Chức năng cập nhật: Không tìm thấy SV");
    }
  };
}

DanhSachSinhVien.prototype.timKiemTen = function (tk) {
  var mangTk = [];
  var tkLowerCase = tk.toLowerCase();
  this.mangSV.map((sv) => {
    var tenLowerCase = sv.tenSV.toLowerCase();
    var indexTK = tenLowerCase.indexOf(tkLowerCase);
    if (indexTK > -1) {
      mangTk.push(sv);
    }
  });
  return mangTk;
};
