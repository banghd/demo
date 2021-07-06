import { useState, useEffect } from 'react'
import axios from 'axios'

function UserAPI(token) {
    const [isLogged, setIsLogged] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cart, setCart] = useState([])
    const [history, setHistory] = useState([])
    const [name , setName] = useState('')
    useEffect(() => {
        if (token) {
            const getUser = async () => {
                try {
                    const res = await axios.get('/user/information', {
                        headers: { Authorization: token }
                    })
                    setIsLogged(true)
                    res.data.role === 1 ? setIsAdmin(true) : setIsAdmin(false)
                    setName(res.data.name)
                   const data = res.data.cart
                    let cart = data.map(x => x.product)
                   for(let i = 0;i<data.length;i++){
                       cart[i].quantity = data[i].soluongmua
                   }
                    setCart(cart)

                } catch (error) {
                    console.log( (error.response || {}).data );
                return false;
                }
            }

            getUser()

        }
    }, [token])



    const addCart = async (product) => {
        if (!isLogged) return alert("Please login to continue buying")

        const check = cart.every(item => {
            return item._id !== product._id
        })

        if (check) {
            setCart([...cart, { ...product, quantity: 1 }])
         const res =   await axios.post('/user/addcart', { cart: [...cart, { ...product, quantity: 1 }] }, {
                headers: { Authorization: token }
            })

            alert(res.data.msg)
        } else {
            alert("This product has been added to cart.")
        }
    }

    return {
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        cart: [cart, setCart],
        addCart: addCart,
        history: [history, setHistory],
        name : [name, setName]
    }
}

export default UserAPI
