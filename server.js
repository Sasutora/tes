
const express = require('express')
const { Sequelize, Op } = require('sequelize');
const User = require('./user.js');
const Epresence = require('./Epresence.js');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');
const app = express()
require('dotenv').config();
const sequelize = require('./database');
app.use(express.json())
const post = [
    {
        username:'rama',
        title:'test'
    }
]
app.get('/absen',authenticateToken,async (req,res)=>{
   const absensi = await Epresence.findAll({
    where:{
        id_users:req.user.id
    }
   })
const hasil = prosesDataAbsensi(absensi)
   return res.status(201).json({
    status: "success",
    content: "Attendance recorded successfully",
    absen : hasil
});
})

app.post('/absen',authenticateToken, async (req, res) => {
    const { type, waktu } = req.body;
    const userId = req.user.id;

   
    const date = waktu.split(' ')[0]; 

    try {
     
        const existingAbsence = await Epresence.findOne({
            where: {
                id_users: userId,
                type: type,
                waktu: {
                    [Sequelize.Op.startsWith]: date
                }
            }
        });

        if (existingAbsence) {
            return res.status(400).json({
                status: "already_checked_in",
                content: `You have already check-${type}  on ${date}`
            });
        }

        const absen = await Epresence.create({
            id_users: userId,
            type: type,
            is_approve: "FALSE",
            waktu: waktu,
        });

        return res.status(201).json({
            status: "success",
            content: "Attendance recorded successfully",
            absen : absen
        });
    } catch (error) {
        return res.status(500).json({
            status: "database_error",
            content: error
        });
    }
});
app.put('/approve',authenticateToken,async (req,res)=>{
    const { id_absen } = req.body;
  
    try {
        const supervisor = await User.findOne({
            where:{
                id:req.user.id
            } 
        })
        if (!supervisor) {
            return res.status(404).json({
                status: "error",
                message: "supervisor tidak ditemukan"
            });
        }
        const absensi = await Epresence.findOne({
            where: { id: id_absen },
            include: [{
                model: User,
            }]
        });


        if (!absensi) {
            return res.status(404).json({
                status: "error",
                message: "Absensi tidak ditemukan"
            });
        }
if(supervisor.npp == absensi.User.npp_supervisor){
    absensi.is_approve = "TRUE";
    await absensi.save();

    return res.status(200).json({
        status: "success",
        content: absensi
    });
}else{

    return res.status(401).json({
        status: "Anda Bukan supervisor orang ini",
    });
}
     
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: "error",
            message: "Contact developer"
        });
    }
 })
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({
        where: {
            email: email,
        }
    });
    if(!user) return res.status(401).json({
        status: "invalid_credentials",
        content: {}
    });

    const isMatch = await bcrypt.compare(password,user.password)
    if (isMatch == false) {
        return res.status(401).json({
            status: "invalid_credentials",
            content: {}
        });
    }
    const token = jwt.sign(
        { id: user.id, email: user.email }, 
        process.env.ACCESS_TOKEN_SECRET, 
        { expiresIn: "1h" } 
    );
    return res.status(200).json({
        status: "success",
        content: {
            message: "Login successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email
            }
        },
        token: token
    });
})

app.post('/signup',async (req,res)=>{
    const{name,email,password, npp, npp_supervisor} = req.body
    const hash = await bcrypt.hash(password,13)
    let newUser;
    try {
        newUser = await User.create({
            name: name,
            email: email,
            password: hash,
            npp:npp,
            npp_supervisor:npp_supervisor
        });
    
    } catch (error) {
        if(error.name === "SequelizeUniqueConstraintError") return res.status(400).json({
            status: "user_already_registered",
            content: {}
        });

        return res.status(500).json({
            status: "database_error1",
            content: error
        });
    }
    return res.status(201).json({
        status: "success",
        content: "User created"
    });
})

function authenticateToken (req, res, next) {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Get token from "Bearer <token>"

    if (!token) {
        return res.status(401).json({ status: "unauthorized", content: "Token required" });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.status(403).json({ status: "forbidden", content: "Invalid token" });

        req.user = user; // Attach user info to request
        next();
    });
};
// TEST LOGIKA


function prosesDataAbsensi(data) {
    const absen = data;
    const hasil = {};

    absen.forEach(item => {
        const { id_users, type, is_approve, waktu } = item;
        const tanggal = waktu.split(' ')[0]; 

        
        const kunci = `${id_users}-${tanggal}`;

        
        if (!hasil[kunci]) {
            hasil[kunci] = {
                id_user: id_users,
                nama_user: "", 
                tanggal: tanggal,
                waktu_masuk: null,
                waktu_keluar: null,
                status_masuk: null,
                status_keluar: null
            };
        }


        if (type === "IN") {
            hasil[kunci].waktu_masuk = waktu.split(' ')[1]; // Ambil waktu saja
            hasil[kunci].status_masuk = is_approve;
        } else if (type === "OUT") {
            hasil[kunci].waktu_keluar = waktu.split(' ')[1]; // Ambil waktu saja
            hasil[kunci].status_keluar = is_approve;
        }
    });


    return Object.values(hasil);
}

app.get('/logika',async (req,res)=>{
    console.log(hitungPasangKaosKaki([10, 20, 20, 10, 10, 30, 50, 10, 20])); 
    console.log(hitungPasangKaosKaki([6, 5, 2, 3, 5, 2, 2, 1, 1, 5, 1, 3, 3, 3, 5])); 
    console.log(hitungPasangKaosKaki([1, 1, 3, 1, 2, 1, 3, 3, 3, 3])); 
})
function hitungPasangKaosKaki(ukuranKaosKaki) {
   
    const frekuensi = {};

    for (const ukuran of ukuranKaosKaki) {
        if (frekuensi[ukuran]) {
            frekuensi[ukuran]++;
        } else {
            frekuensi[ukuran] = 1;
        }
    }

    let jumlahPasang = 0;
    for (const jumlah of Object.values(frekuensi)) {
        jumlahPasang += Math.floor(jumlah / 2);
    }

    return jumlahPasang;
}





app.listen(3000)