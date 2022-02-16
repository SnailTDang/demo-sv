//Global
var dssv = new DanhSachSinhVien();
var validation = new Validation();

//Lấy danh sách ngay khi load trang
getLocalStore();

//Hàm rút gọn cú pháp getElementById
function getELE(id) {
  //id là kiểu string
  return document.getElementById(id);
}

function themSinhVien() {
  //Lấy dữ liệu từ form
  var maSV = document.getElementById("txtMaSV").value;
  var tenSV = getELE("txtTenSV").value;
  var email = getELE("txtEmail").value;
  var matKhau = getELE("txtPass").value;
  var ngaySinh = getELE("txtNgaySinh").value;
  var khoaHoc = getELE("khSV").value;
  var toan = getELE("txtDiemToan").value;
  var ly = getELE("txtDiemLy").value;
  var hoa = getELE("txtDiemHoa").value;

  //Kiểm tra dữ liệu (validation)
  //Khởi tạo isValid = true => giả sử dữ liệu hợp lệ
  //&&, ||
  //true && true => true
  //& => cộng theo BIT (01010101)
  // 1 & 1
  var isValid = true;
  // isValid(moi) = isValid(Cũ) & 1(true)
  //kiểm tra mã: không được trống, không được trùng
  isValid &=
    validation.checkEmpty(
      maSV,
      "spanMaSV",
      "Mã sinh viên không được để trống"
    ) &&
    validation.checkID(
      maSV,
      "spanMaSV",
      "Mã sinh viên không được trùng",
      dssv.mangSV
    );

  //kiểm tra tên: không được trống, phải là ký tự chữ (không có số, không có ký tự đặc biệt)
  isValid &=
    validation.checkEmpty(
      tenSV,
      "spanTenSV",
      "Tên sinh viên không được để trống"
    ) && validation.checkName(tenSV, "spanTenSV", "Tên sinh viên phải là chữ");

  //kiểm tra email: định dạng email
  isValid &= validation.checkEmail(
    email,
    "spanEmailSV",
    "Email chưa đúng định dạng"
  );
  //kiểm tra pass: định dạng pass (có 1 ký chư, 1 in hoa, 1 số, 1 đặc biet, độ dài)
  isValid &= validation.checkPass(
    matKhau,
    "spanMatKhau",
    "Mật khẩu chưa đúng định dạng"
  );

  //kiem tra KH
  isValid &= validation.checkSelect(
    "khSV",
    "spanKhoaHoc",
    "Bạn chưa chọn khóa học"
  );

  //kiem tra toán: không dể trống, dúngđịnh dạng điểm (0-> 10)
  isValid &= validation.checkMark(toan, "spanToan", "Điểm chưa hợp lệ");

  if (isValid) {
    //toàn bộ dữ liệu hợp lệ
    //tạo thể hiện của lớp SinhVien
    var sv = new SinhVien(
      maSV,
      tenSV,
      email,
      matKhau,
      ngaySinh,
      khoaHoc,
      Number(toan),
      Number(ly),
      Number(hoa)
    );
    sv.tinhDTB();
    // console.log(sv);
    dssv.themSV(sv);
    // console.log(dssv.mangSV);
    hienThiTable(dssv.mangSV);
    //? Khi mảng SV bị thay đổi (thêm, xóa, sửa sv trong mảng)=> lưu xuống localStorage
    setLocalStorage(dssv.mangSV);
  }
}

function hienThiTable(mangSV) {
  //for
  // map() : hàm tạo sẵn của JS giúp duyệt mảng
  //!ham1(bien), ham1("text"), ham1(ham2()): callback function (ham2() phải có return)
  //!function() : hàm ẩn danh
  //!map(function(item, index){}); item: 1 phần tử mảng (không cần lấy phần tử bằng index => mang[index])
  //content: chứa các thẻ tr, mỗi tr chứa thông tin của 1 sv
  var content = "";
  mangSV.map(function (sv, index) {
    //content(mới) = content(cũ) + "<tr></tr>"
    //? content += "<tr><td>"+sv.maSV+"</td></tr>"
    // string template/ template literal
    content += `<tr>
            <td>${sv.maSV}</td>
            <td>${sv.tenSV}</td>
            <td>${sv.email}</td>
            <td>${sv.ngaySinh}</td>
            <td>${sv.khoaHoc}</td>
            <td>${sv.dtb}</td>
            <td>
                <button class="btn btn-danger" onclick="xoaSinhVien('${sv.maSV}')" >Xóa</button>
                <button class="btn btn-info" onclick="xemChiTiet('${sv.maSV}')">Xem</button>
            </td>
        </tr>`;
  });

  getELE("tbodySinhVien").innerHTML = content;
}
// localStorage: kho lưu data của browser (data: tạm thời - giỏ hàng, không cần bảo mật )
function setLocalStorage(mangSV) {
  // JSON: là đối tượng của JS dùng để chứa các method xử lý dữ liệu json
  //stringify : chuyển mảng sang json
  //! mảng => json
  localStorage.setItem("DSSV", JSON.stringify(mangSV));
}
function getLocalStore() {
  //!json => mảng
  //parse: chuyển từ json về mảng
  //Kiểm tra có localStorage không
  if (localStorage.getItem("DSSV") != null) {
    //nếu không null => có localstorage
    dssv.mangSV = JSON.parse(localStorage.getItem("DSSV"));
    hienThiTable(dssv.mangSV);
  }
}

/**
 * Xóa SV => xóa phần tử khỏi mảng
 * 1. tìm được vị trí (index) phần tử
 * 2. maSV => tìm vị trí sv trong mảng
 * 3. Sử dụng hàm của js để xóa phần tử khỏi mảng
 */
//Xóa khi người dùng click button Xóa
function xoaSinhVien(ma) {
  console.log(ma);
  dssv.xoaSV(ma);
  setLocalStorage(dssv.mangSV);
  getLocalStore();
}

/**
 * Cập nhật
 * Luồng 1: Xem thông tin chi tiết
 * 1. tìm vị trí (ma)
 * 2. Trả về sv cần xem thông tin
 * 3. Hiển thị thông tin lên UI
 * Luồng 2: Cập nhật thông tin
 *
 */

function xemChiTiet(ma) {
  console.log(ma);
  var viTri = dssv.timViTri(ma);
  if (viTri > -1) {
    var sv = dssv.mangSV[viTri];
    getELE("txtMaSV").value = sv.maSV;
    getELE("txtMaSV").disabled = true;

    getELE("txtTenSV").value = sv.tenSV;
    getELE("txtEmail").value = sv.email;
    getELE("txtPass").value = sv.matKhau;
    getELE("txtNgaySinh").value = sv.ngaySinh;
    getELE("khSV").value = sv.khoaHoc;
    getELE("txtDiemToan").value = sv.toan;
    getELE("txtDiemLy").value = sv.ly;
    getELE("txtDiemHoa").value = sv.hoa;
  } else {
    console.log("Chức năng xem: không tim thấy sv");
  }
}
function capNhat() {
  //Lấy dữ liệu từ form
  //Mã SV không được đổi
  var maSV = document.getElementById("txtMaSV").value;
  var tenSV = getELE("txtTenSV").value;
  var email = getELE("txtEmail").value;
  var matKhau = getELE("txtPass").value;
  var ngaySinh = getELE("txtNgaySinh").value;
  var khoaHoc = getELE("khSV").value;
  var toan = Number(getELE("txtDiemToan").value);
  var ly = Number(getELE("txtDiemLy").value);
  var hoa = Number(getELE("txtDiemHoa").value);

  //tạo thể hiện của lớp SinhVien
  var sv = new SinhVien(
    maSV,
    tenSV,
    email,
    matKhau,
    ngaySinh,
    khoaHoc,
    toan,
    ly,
    hoa
  );
  sv.tinhDTB();

  dssv.capNhatSV(sv);
  setLocalStorage(dssv.mangSV);
  getLocalStore();
}
function resetForm() {
  getELE("formQLSV").reset();
  getELE("txtMaSV").disabled = false;
}

function timKiem() {
  var tk = getELE("txtSearch").value;
  var mangTk = dssv.timKiemTen(tk);
  hienThiTable(mangTk)
}

getELE("btnSearch").addEventListener("click", timKiem);
getELE("txtSearch").addEventListener("keydown", timKiem)
