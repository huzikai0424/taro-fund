const getAllFundData = () => {
    return JSON.parse(localStorage.getItem('fund')) || []
}
/**
 * 获得基金概要
 * @param {string} code | 基金代码
 */
const getFundData = (code) => {
    return getAllFundData.find((item => {
        item.code===code
    }))
}
/**
 * 获得全部基金列表
 */
const getFundList = () => {
    let fundList = []
    getAllFundData().forEach((item) => {
        fundList.push(item.id)
    })
    return fundList
}
/**
 * 基于Promise的jsonp
 * @param {string} url | 请求url
 * @param {string} jsonpCallback | jsonp回调函数名
 */
const jsonp = (url, jsonpCallback = 'jsonpgz') => {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script')
        script.src = `${url}&callback=callback`
        script.onload = (e) => {
            e.currentTarget.remove()
        }
        script.onerror = (e) => {
            reject('data is empty')
            e.currentTarget.remove()
        }
        window[jsonpCallback] = data => {
            if (!data) {
                reject('data is empty')
            } else {
                resolve(data)
            }
        }
        document.body.appendChild(script)
    })
}
const addFund = (data) => {
    const fundData = getAllFundData()
    fundData.push(data)
    localStorage.setItem('fund',JSON.stringify(fundData))
}
const deleteFundById = (id) => {
    let newFund = getAllFundData().filter((item) => {
        return item.id!=id
    })
    localStorage.setItem('fund',JSON.stringify(newFund))
} 
export {
    getAllFundData,
    getFundData,
    jsonp,
    getFundList,
    addFund,
    deleteFundById
}