export const testController = (req, res) => {
    res.status(200).send({
        message: 'Test ',
        success: true
    })
}