const home = (request , response) => {
     response.status(200).json({
        message: 'Welcome to the home page'
     });
}

const homeList = (request, response) => {
    const { id } =  request.params;
    response.status(200).json({
        message: `Welcome to the home page with id ${id}`
    }); 
}


module.exports = {
    home,
    homeList
}