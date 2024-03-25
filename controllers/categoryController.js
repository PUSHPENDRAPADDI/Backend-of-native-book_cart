// Create category 

export const createCategoryController = () => {
    try {

    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create Category API'
        })
    }
}