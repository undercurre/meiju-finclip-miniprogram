
const formatDate = (str) => {
        let date = new Date(str);
        let year = date.getFullYear();
        let month= date.getMonth() + 1;
        month= month< 10 ? ('0' + month) : month;
        let day = date.getDate();
        day = day < 10 ? ('0' + day ) : day ;
        return year + '-' + month + '-' + day;
    }

    module.exports = {
        formatDate:formatDate
    }