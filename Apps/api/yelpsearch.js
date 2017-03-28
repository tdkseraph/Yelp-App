const params = {
    client_id: 'qDPlyf_EBtljgqKxPALx6Q',
    client_secret: 'RlFVBx8XonMjZcNnal3e827ooycXR7Pc4JngdpbM6UmdbW61GEfiss22OMRK0p4M', // use your own
    grant_type: 'client_credentials',
    url : "https://api.yelp.com/v3/businesses/search?location=US"
}

export const Yelp = {
    async getToken() {
        await getYelpToken();
    },
     async searchWithFilter(keyword) {
        let token = await getYelpToken();
        var data = await searchByKeyword(token,keyword);
        return data;
    },
    async getCategories() {
        var data = await getCategory();
        console.log(data[0]);
        return data;
    }
}

async function getYelpToken() {
    console.log('getYelpToken');
    const request = new Request('https://api.yelp.com/oauth2/token', {
        method: 'POST',
        headers: new Headers({'content-type': 'application/x-www-form-urlencoded;charset=utf-8'}),
        body: `client_id=${params.client_id}&client_secret=${params.client_secret}&grant_type=${params.grant_type}`
    });

    return fetch(request).then(response => {
        return response.json()
    }).then(json => {
        return json;
    })
};

async function searchByKeyword(token = {},searchTerm = '') {
    if (token == undefined) 
        token = getYelpToken();
    let authorization = token.token_type + ' ' + token.access_token;
    console.log(authorization);
    var url = params.url;
    if(searchTerm.length !== 0)
    {
        url += searchTerm;
    }
    return await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: ""
    }).then((response) => response.json()).then((responseData) => {
        console.log(responseData.businesses[0])
        return responseData.businesses; 
    });
};

async function getCategory() {
    let url = 'https://www.yelp.com/developers/documentation/v3/all_category_list/categories.json';
    const request = new Request(url);

    return await fetch(request).then(response => {
        return response.json()
    }).then(responseJson => {
        let newArray = [];
        responseJson.forEach(function (item) {
            let obj = {
                alias: item.alias,
                title: item.title,
                check: false
            };
            newArray.push(obj);
        })
        //console.log(newArray[0])
        return newArray;
    })

}