
$(function () {
    $('.navbar .navbar-nav a').not('.dropdown-toggle').bind('click', function (event) {
        const $anchor = $(this).attr('href'),
            $func = $anchor.substr(1, $anchor.length);

        eval($func);
        return false;
    });
});


const cvs = document.getElementById("kanvas"),
    ctx = cvs.getContext("2d"),
    myImg = new Image();

let frameVideo;

$(myImg).attr("src", "img/image.jpg");

const readURL = input => {
    if (input.files && input.files[0]) {
        const reader = new FileReader();
        reader.onload = function (e) {
            $(myImg).attr("src", e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
        $('.ascii-box').remove();
        $(cvs).show();
    }
};

$(imgFile).change(function () {
    readURL(this);
});

$(myImg).load(function () {
    $(kanvas).attr("width", myImg.width);
    $(kanvas).attr("height", myImg.height);
    ctx.drawImage(myImg, 0, 0);
    $("#inp-brightness").val(0);
    $("#inp-contrass").val(0);

    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    $("#imgwidth").text("Width: " + imgData.width + "px");
    $("#imgheight").text("Height: " + imgData.height + "px");
    $("#imglength").text("Length: " + imgData.data.length + "px");
    $(".imgtitle span").text("Citra Asli");
});


//  Reset
const resetGambar = () => {
    $(kanvas).attr("width", myImg.width);
    $(kanvas).attr("height", myImg.height);
    $(".imgtitle span").text("Citra Asli");
    ctx.drawImage(myImg, 0, 0);
    $("#inp-brightness").val(0);
    $("#inp-contrass").val(0);
    $("#hist").hide();
    $('.ascii-box').remove();
    $(cvs).show();
};


// FILTER
const gaussianFilter = radius => {

    if ("number" != typeof radius)
        console.log("radius must be a number");
    if (radius < 1)
        console.log("radius must be greater than 0");

    const r = radius,
        rs = Math.ceil(r * 2.57); // significant radius

    // read img data
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const temp = imgData.data, iWidth = imgData.width, iHeight = imgData.height;

    // manipulation
    for (let y = 0; y < iHeight; y++) {
        // console.log("Gaussian: " + Math.round(y / iHeight * 100) + "%");
        for (let x = 0; x < iWidth; x++) {
            let red = 0;
            let green = 0;
            let blue = 0;
            let alpha = 0;
            let wsum = 0;
            for (let iy = y - rs; iy < y + rs + 1; iy++) {
                for (let ix = x - rs; ix < x + rs + 1; ix++) {
                    const x1 = Math.min(iWidth - 1, Math.max(0, ix));
                    const y1 = Math.min(iHeight - 1, Math.max(0, iy));
                    const dsq = (ix - x) * (ix - x) + (iy - y) * (iy - y);
                    const wght = Math.exp(-dsq / (2 * r * r)) / (Math.PI * 2 * r * r);
                    var idx = (y1 * iWidth + x1) << 2;
                    red += temp[idx] * wght;
                    green += temp[idx + 1] * wght;
                    blue += temp[idx + 2] * wght;
                    alpha += temp[idx + 3] * wght;
                    wsum += wght;
                }

                var idx = (y * iWidth + x) << 2;
                temp[idx] = Math.round(red / wsum);
                temp[idx + 1] = Math.round(green / wsum);
                temp[idx + 2] = Math.round(blue / wsum);
                temp[idx + 3] = Math.round(alpha / wsum);
            }
        }
    }

    imgData.data = temp;

    // manemapilkan hasil
    ctx.putImageData(imgData, 0, 0);

    $(".imgtitle span").text("Gaussian Blur");

};
// Citra Grayscale
const grayscaleImage = () => {

    // Load gambar default
    ctx.drawImage(myImg, 0, 0);

    // mengambil data gambar
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);

    // manipulasi, proses perhitungan
    for (let i = 0; i < imgData.data.length; i += 4) {
        let gr = imgData.data[i] * 0.299 + imgData.data[i + 1] * 0.587 + imgData.data[i + 2] * 0.114;
        if (gr < 0) gr = 0;
        if (gr > 255) gr = 255;
        imgData.data[i] = gr;
        imgData.data[i + 1] = gr;
        imgData.data[i + 2] = gr;
    }
    // menampilkan hasil
    ctx.putImageData(imgData, 0, 0);

    $(".imgtitle span").text("Citra Keabuan");

};
// Citra Negatif
const negatifImage = () => {

    //load gambar
    ctx.drawImage(myImg, 0, 0);

    // mengambil data gambar
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);

    // memanipulasi menjadi negatif
    for (let i = 0; i < imgData.data.length; i += 4) {
        imgData.data[i] = 255 - imgData.data[i] | 0;
        imgData.data[i + 1] = 255 - imgData.data[i + 1] | 0;
        imgData.data[i + 2] = 255 - imgData.data[i + 2] | 0;
    }

    // menampilkan hasil manipulasi
    ctx.putImageData(imgData, 0, 0);

    $(".imgtitle span").text("Citra Negatif");

};




// Citra Biner
const hitamPutihImage = () => {

    // mengambil gambar default
    ctx.drawImage(myImg, 0, 0);

    // mengambil data gambar
    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);

    // memanipulasi/ proses perhitungan hitam putih
    for (let i = 0; i < imgData.data.length; i += 4) {
        let gr = (imgData.data[i] + imgData.data[i + 1] + imgData.data[i + 2]) / 3;
        if (gr <= 128) gr = 0;
        if (gr > 128) gr = 255;
        imgData.data[i] = gr;
        imgData.data[i + 1] = gr;
        imgData.data[i + 2] = gr;
    }

    // menampilkan image
    ctx.putImageData(imgData, 0, 0);
    $(".imgtitle span").text("Citra Biner");

};

// Citra Biner Operasi NOT/kebalikan dari hitam putih
const putihHitamImage = () => {

    const imgData = ctx.getImageData(0, 0, cvs.width, cvs.height);

    // manipulation / perhitungan
    for (let i = 0; i < imgData.data.length; i += 4) {
        const gr = imgData.data[i];
        imgData.data[i] = (gr === 0) ? 255 : 0;
        imgData.data[i + 1] = (gr === 0) ? 255 : 0;
        imgData.data[i + 2] = (gr === 0) ? 255 : 0;
    }

    // menampilkan hasil
    ctx.putImageData(imgData, 0, 0);
    $(".imgtitle span").text("Citra Biner NOT");

};


// Operasi Sobel
const tepiSobel = () => {
    // Read image data
    const dataCitra = ctx.getImageData(0, 0, cvs.width, cvs.height);
    const dataPiksel = dataCitra.data;
    const lebarCitra = dataCitra.width, tinggiCitra = dataCitra.height;
    const dataGrayscale = new Uint8ClampedArray(lebarCitra * tinggiCitra); 
    //tipe array yang digunakan untuk menyimpan data bilangan bulat tidak bertanda 8-bit (byte), 
    //di mana rentang nilainya antara 0 hingga 255. Variabel ini nantinya akan digunakan untuk menyimpan
    //nilai-nilai kecerahan piksel setelah citra diubah ke skala keabuan.

    // Konversi citra ke skala keabuan
    for (let i = 0; i < dataPiksel.length; i += 4) {
        const skalaKeabuan = Math.round(0.299 * dataPiksel[i] + 0.587 * dataPiksel[i + 1] + 0.114 * dataPiksel[i + 2]);
        dataGrayscale[i / 4] = skalaKeabuan;
    }
    
    // Operasi Sobel untuk deteksi tepi
    const dataTepi = new Uint8ClampedArray(lebarCitra * tinggiCitra);
    
    for (let y = 1; y < tinggiCitra - 1; y++) {
        for (let x = 1; x < lebarCitra - 1; x++) {
            const pikselX = (
                -dataGrayscale[(y - 1) * lebarCitra + (x - 1)] -
                2 * dataGrayscale[y * lebarCitra + (x - 1)] -
                dataGrayscale[(y + 1) * lebarCitra + (x - 1)] +
                dataGrayscale[(y - 1) * lebarCitra + (x + 1)] +
                2 * dataGrayscale[y * lebarCitra + (x + 1)] +
                dataGrayscale[(y + 1) * lebarCitra + (x + 1)]
            );
    
            const pikselY = (
                -dataGrayscale[(y - 1) * lebarCitra + (x - 1)] -
                2 * dataGrayscale[(y - 1) * lebarCitra + x] -
                dataGrayscale[(y - 1) * lebarCitra + (x + 1)] +
                dataGrayscale[(y + 1) * lebarCitra + (x - 1)] +
                2 * dataGrayscale[(y + 1) * lebarCitra + x] +
                dataGrayscale[(y + 1) * lebarCitra + (x + 1)]
            );
    
            const gradien = Math.sqrt(pikselX * pikselX + pikselY * pikselY); 
            //math.sqrt menghitung akar kuadrat dari sebuah bilangan.
            dataTepi[y * lebarCitra + x] = gradien;
        }
    }
    
    // Normalisasi dataTepi
    let gradienMaksimal = -Infinity;
    for (let i = 0; i < dataTepi.length; i++) {
        if (dataTepi[i] > gradienMaksimal) {
            gradienMaksimal = dataTepi[i];
        }
    }
    
    for (let i = 0; i < dataTepi.length; i++) {
        dataTepi[i] = (dataTepi[i] / gradienMaksimal) * 255;
    }
    
    // Memperbarui data citra dengan hasil Sobel
    for (let i = 0; i < dataTepi.length; i++) {
        const intensitas = dataTepi[i];
        dataPiksel[i * 4] = intensitas;
        dataPiksel[i * 4 + 1] = intensitas;
        dataPiksel[i * 4 + 2] = intensitas;
    }
    
    dataCitra.data = dataPiksel;
    
    // Tampilkan hasilnya
    ctx.putImageData(dataCitra, 0, 0);
    $(".imgtitle span").text("Deteksi Tepi Sobel");
    
};



