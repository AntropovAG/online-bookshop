const checkResponse = (res) => {
    if (res.ok) {
        return res.json();
    }
    return res.json().then((res) => Promise.reject(res.message));
};


export function requestBooks(request, startIndex = 0) {
    return fetch(`https://www.googleapis.com/books/v1/volumes?q="subject:${request}"&key=AIzaSyAw8dYZxnbBh_ADDcduDpF3PWGRAcIqC14&printType=books&startIndex=${startIndex}&maxResults=6&langRestrict=en`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        }
    }).then(checkResponse);
}