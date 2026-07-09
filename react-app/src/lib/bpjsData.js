// Dummy BPJS data by NIK
export const BPJS_DATABASE = {
    '3201051234567890': {
        nik: '3201051234567890',
        fullName: 'Budi Santoso',
        birthDate: '1990-05-12',
        gender: 'Laki-laki',
        address: 'Jl. Merdeka No. 45, Bandung',
        phone: '081234567890',
        bpjsNumber: 'KES-123456789',
        bpjsStatus: 'Aktif',
        bpjsClass: 'Kelas II',
        registeredAt: '2020-01-15',
        lastCheckup: '2026-06-20',
        bloodType: 'O+',
        medicalHistory: ['Hipertensi', 'Kolesterol'],
    },
    '3201051234567891': {
        nik: '3201051234567891',
        fullName: 'Siti Nurhaliza',
        birthDate: '1995-03-22',
        gender: 'Perempuan',
        address: 'Jl. Gatot Subroto No. 12, Bandung',
        phone: '081987654321',
        bpjsNumber: 'KES-987654321',
        bpjsStatus: 'Aktif',
        bpjsClass: 'Kelas I',
        registeredAt: '2019-06-10',
        lastCheckup: '2026-05-15',
        bloodType: 'A-',
        medicalHistory: [],
    },
    '3201051234567892': {
        nik: '3201051234567892',
        fullName: 'Ahmad Wijaya',
        birthDate: '1988-07-08',
        gender: 'Laki-laki',
        address: 'Jl. Diponegoro No. 88, Bandung',
        phone: '082123456789',
        bpjsNumber: 'KES-555666777',
        bpjsStatus: 'Aktif',
        bpjsClass: 'Kelas III',
        registeredAt: '2021-03-20',
        lastCheckup: '2026-06-01',
        bloodType: 'B+',
        medicalHistory: ['Diabetes'],
    },
    '3201051234567893': {
        nik: '3201051234567893',
        fullName: 'Eka Putri Lestari',
        birthDate: '1992-11-30',
        gender: 'Perempuan',
        address: 'Jl. Ahmad Yani No. 56, Bandung',
        phone: '083456789012',
        bpjsNumber: 'KES-444555666',
        bpjsStatus: 'Aktif',
        bpjsClass: 'Kelas II',
        registeredAt: '2018-08-05',
        lastCheckup: '2026-06-15',
        bloodType: 'AB+',
        medicalHistory: ['Asma'],
    },
};

export function getBPJSDataByNIK(nik) {
    return BPJS_DATABASE[nik] || null;
}

export function getAllValidNIKs() {
    return Object.keys(BPJS_DATABASE);
}
