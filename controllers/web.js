

module.exports = (req, res, next) => {
    res.writeHead(301, { Location: 'https://www.archeosite.be/fr/home-2/'}).end();
};

