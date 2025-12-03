


// create token and saving in cookies 

const sendShopToken = (user,statuscode,res)=>{
    const token = user.getJwtToken();

    //options for cookies
    const options = {
        expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        httpOnly:true
    };

    res.status(statuscode).cookie("seller_token", token,options).json({
        success:true,
        user,
        token,

    });
};

module.exports = sendShopToken