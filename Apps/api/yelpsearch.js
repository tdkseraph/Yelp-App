const params = {
    client_id: 'tQyHUDn9ocxSt62kfaLS1w',
    client_secret: '863nET7GMULkWMRaqCsnwV5xLwsmMv6TsQEsMxT3uoUMvV6mg6sCGXEO3XyccPUr', // use your own
    grant_type: 'client_credentials',
    url : "https://api.yelp.com/v3/businesses/search?location=US"
}

export const Yelp = {
    async getToken() {
        await getYelpToken();
    },
    async searchWithFilter() {
        let token = await getYelpToken();
        await searchByKeyword(token);
    },
    async getCategories() {
        return await getCategory();
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
        token = await getYelpToken();
    let authorization = token.token_type + ' ' + token.access_token;
    var url = param.url + '&'
    if(searchTerm.length !== 0)
    {
        url += searchTerm;
    }
    await fetch(url, {
        method: "GET",
        headers: {
            'Authorization': authorization,
            'Content-Type': 'application/json'
        },
        body: ""
    }).then((response) => response.json()).then((responseData) => {
        return responseData.businesses
    }).done();
};

async function getCategory(limit) {
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
        return newArray;
    })

}