
document.addEventListener("DOMContentLoaded", () => {
  fetchData()
})

const fetchData = async () => {
  try {
      const res = await fetch('api.json')
      const data = await res.json()
      mostrarProductos(data)
      detectarBotones(data)
  } catch (error) {
      console.log(error)
  }
}

const contendorProductos = document.querySelector('#contenedor-productos')
const mostrarProductos = (data) => {
  const template = document.querySelector('#template-productos').content
  const fragment = document.createDocumentFragment()
  data.forEach(producto => {
      template.querySelector('img').setAttribute('src',producto.imagen)
      template.querySelector('h5').textContent = producto.title  
      template.querySelector('.descripcion').textContent = producto.descripcion 
      template.querySelector('p span').textContent = producto.precio
      template.querySelector('button').dataset.id = producto.id
      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
  })
  contendorProductos.appendChild(fragment)
}

let carrito = {}

const detectarBotones = (data) => {
  const botones = document.querySelectorAll('.card button')

  botones.forEach(btn => {
      btn.addEventListener('click', () => {
          const producto = data.find(item => item.id === parseInt(btn.dataset.id))
          producto.cantidad = 1
          if (carrito.hasOwnProperty(producto.id)) {
              producto.cantidad = carrito[producto.id].cantidad + 1
          }
          carrito[producto.id] = { ...producto }
         
          mostrarCarrito()
      })
  })
}

const items = document.querySelector('#items')

const mostrarCarrito = () => {

  items.innerHTML = ''

  const template = document.querySelector('#template-carrito').content
  const fragment = document.createDocumentFragment()

  Object.values(carrito).forEach(producto => {
 
      template.querySelector('th').textContent = producto.id
      template.querySelectorAll('td')[0].textContent = producto.title
      template.querySelectorAll('td')[1].textContent = producto.cantidad
      template.querySelector('span').textContent = producto.precio * producto.cantidad
      
      template.querySelector('.btn-info').dataset.id = producto.id
      template.querySelector('.btn-danger').dataset.id = producto.id

      const clone = template.cloneNode(true)
      fragment.appendChild(clone)
      localStorage.setItem('compra', producto.title);
      localStorage.setItem('acomprar', producto.precio);

  })

  items.appendChild(fragment)

  mostrarFooter()
  accionBotones()

}

const footer = document.querySelector('#footer-carrito')
const mostrarFooter = () => {

  footer.innerHTML = ''

  if (Object.keys(carrito).length === 0) {
      footer.innerHTML = `
      <th scope="row" colspan="5">Carrito vacío a Comprar</th>
      `
      return
  }

  const template = document.querySelector('#template-footer').content
  const fragment = document.createDocumentFragment()


  const aCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
  const aPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)


  template.querySelectorAll('td')[0].textContent = aCantidad
  template.querySelector('span').textContent = aPrecio

  const clone = template.cloneNode(true)
  fragment.appendChild(clone)

  footer.appendChild(fragment)


  const boton = document.querySelector('#vaciar-carrito')
  boton.addEventListener('click', () => {
      carrito = {}
      mostrarCarrito()
  })
  addLocalStorage()
}

const accionBotones = () => {
  const botonesAgregar = document.querySelectorAll('#items .btn-info')
  const botonesEliminar = document.querySelectorAll('#items .btn-danger')
  const botonComprar = document.querySelectorAll(' #comprar-carrito')

  botonesAgregar.forEach(btn => {
      btn.addEventListener('click', () => {
          const producto = carrito[btn.dataset.id]
          producto.cantidad ++
          carrito[btn.dataset.id] = { ...producto }
          mostrarCarrito()
      })
  })
    
    botonesEliminar.forEach( btn => {
      btn.addEventListener('click', () => {
          const producto = carrito[btn.dataset.id]
          producto.cantidad --
          if (producto.cantidad === 0) {
              delete carrito[btn.dataset.id]
          } else {
              carrito[btn.dataset .id] = { ...producto }
          }
         
          mostrarCarrito()

        
      })
    })
  

  botonComprar.forEach( btn =>{
    btn.addEventListener('click', () => {
      
      Swal.fire({
     imageUrl: './img/Editable_Family_Pets3.png',
     title: 'Los Datos De Pago',
     html: `<input type="text" id="login" class="swal2-input" placeholder="Nombre">
     <input type="password" id="password" class="swal2-input" placeholder="Nº Tarjeta">
     <input type="tarjeta" id="tarjeta" class="swal2-input" placeholder="Tipo de Tarjeta">
     <input type="text" id="login" class="swal2-input" placeholder="Direccion de envio">`,
     confirmButtonText: 'Comprar',
     focusConfirm: true,
     preConfirm: () => {
       const login = Swal.getPopup().querySelector('#login').value
       const password = Swal.getPopup().querySelector('#password').value
       const tarjeta = Swal.getPopup().querySelector('#tarjeta').value
       if (!login || !password || !tarjeta ) {
         Swal.showValidationMessage(`Por Favor Ingresa Los Datos`)
       }
       return { login: login, password: password , tarjeta: tarjeta}
     }
   
   }).then((result) => {
     Swal.fire(`
       Sr(a): ${result.value.login}
      "Gracias por tu compra"
     `.trim())
         })
       
         const producto = carrito[btn.dataset.id]
         producto.cantidad--
         if (producto.cantidad === 0) {
             delete carrito[btn.dataset.id]
         } else {
             carrito[btn.dataset .id] = { ...producto }
         }
        
         mostrarCarrito()
     })
   

    })

}

function addLocalStorage(){
  localStorage.setItem('carrito', JSON.stringify(carrito))
}

 window.onload = () =>{
   const almacenar = JSON.parse(localStorage.getItem('carrito'))

   if(almacenar){
     carrito = almacenar;
     mostrarCarrito()

   }
 }
