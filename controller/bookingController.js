const Booking = require("../model/bookingModel")

const newBooking = (async (req , res) => {
    const { Customers , Movies , status , seats , amount} = req.body

    const data = await Booking.create({
        Customers , 
        Movies,
        seats,
        status,
        amount
    })

    if(data){
        console.log(data)
        res.status(201).json( {message: "Booking details added!"})
        }else{
    
        res.status(500).json("Something went wrong")
        }
})


module.exports = { newBooking }