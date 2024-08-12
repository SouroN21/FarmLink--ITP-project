const router =require("express").Router();
let delivery=require("../Models/delivery");



http://localhost:5000/delivery/add
router.route("/add").post((req,res) =>{
   
    const fname=req.body.fname;
    const address=req.body.address;
    const city=req.body.city;
    const postalCode=req.body.postalCode;
    const phone=req.body.phone;
    
    const newDelivery=new delivery({
        fname,
        address,
        city,
        postalCode,
        phone
    })

    newDelivery.save().then(()=>{
         res.json("Delivery Added")
    }).catch((err)=>{
        console.log(err);
    })

})

http://localhost:5000/delivery

router.route("/").get((req,res)=>{

    delivery.find().then((delivery)=>{
        res.json(delivery)

    }).catch((err)=>{
        console.log(err)
    })
})

http://localhost:5000/delivery/update

router.route("/update/:id").put(async(req,res)=>{
    let userId = req.params.id;

    const { fname, address, city, postalCode, phone } = req.body;

    const updateDelivery = {
        fname,
        address,
        city,
        postalCode,
        phone
    };

    try {
        await delivery.findByIdAndUpdate(userId, updateDelivery);
        res.status(200).send({ status: "User updated" });
    } catch (err) {
        console.log(err.message); // Logging the error message for better clarity
        res.status(500).send({ status: "Error with updating data", error: err.message });
    }
});


//http://localhost:5000/delivery/delete

router.route("/delete/:id").delete(async (req, res) => {
    let userId = req.params.id;
    await delivery.findByIdAndDelete(userId)
        .then(() => {
            res.status(200).send({ status: "User deleted" });
        }).catch((err) => {
            res.status(500).send({ status: "Error with delete user", error: err.message });
        });
});

router.route("/get/:id").get(async (req, res) => {
    let userId = req.params.id;
    try {
        const user = await delivery.findById(userId);
        res.status(200).send({ status: "User fetched", user });
    } catch (err) {
        console.log(err.message);
        res.status(500).send({ status: "Error with get user", error: err.message });
    }
});


module.exports=router;