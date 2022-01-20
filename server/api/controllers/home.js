

module.exports.home = (req, res) => {
    res.status(200).json({
        message: "Backend working fine!",
        success: true
    });
};

module.exports.notFound = (req, res) => {
    res.status(404).json({
        message: 'Page Not Found',
        success: false
    });
};