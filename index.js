

const login = async () => {
    const idcliente = document.getElementById('idcliente').value;

    const credenciales = {
        Username: "apiUser",
        Password: "ApiUser2021*"
    }

    try {


        const resp = await fetch('https://sandbox.sbsoftware.net/API/v1/login/authenticate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credenciales)
        })

        const data = await resp.json()

        const response = await fetch(`https://sandbox.sbsoftware.net/API/v1/customers/getByDoc?nroDocumento=${idcliente}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + data.token
            }
        })
        const customer = await response.json()

        if (!customer) {
            alert('No existe')
            return
        }

        localStorage.setItem('idCliente', customer[0].idCliente)
        localStorage.setItem('token', data.token)

        window.location = 'pagos.html'


    } catch (error) {
        console.log(error);
    }



}


const pago = async () => {
    try {
        const idcliente = localStorage.getItem("idCliente")
        const token = localStorage.getItem("token")
       
        const loan = await fetch(`https://sandbox.sbsoftware.net/API/v1/payments/${idcliente}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            }
        })
    
        const dataloan = await loan.json()
    
        const datosPrestamo = {
            idPrestamo : dataloan[0].Préstamo,
            importe: dataloan[0].Total,
            fechaVencimiento: "2022-11-10",
            comentario: "Prueba de cobranza por link"
        }
    
        
        const link = await fetch('https://sandbox.sbsoftware.net/API/v1/payments/checkOutLinkMP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(datosPrestamo)
        })
    
        const generateLink = await link.json()
       
        window.open(generateLink.link)
        
    } catch (error) {
        console.log(error);
    }


}


