import dotenv from 'dotenv'
import axios from 'axios'
import qs from 'qs'
import { getLastLog, makeCampaignLog } from './db-operations.js'
import fetch from 'node-fetch'
dotenv.config()
const account_id = process.env.FB_ACCOUNT_ID
const access_token = process.env.FB_ACCESS_TOKEN
const url_header = `https://graph.facebook.com/v17.0/`
const url_footer = `&access_token=${access_token}`

export const getTotalMetrics = async (token) => {


    const headers = {
        'authority': 'adsmanager-graph.facebook.com',
        'accept': '*/*',
        'accept-language': 'en-US,en;q=0.9,es-CO;q=0.8,es;q=0.7',
        'content-type': 'application/x-www-form-urlencoded',
        'cookie': 'datr=p4mYZOggqC7S-jeI86DAi2_O; sb=W6KYZMQBwNGG4gL-rnDwGSJP; c_user=100091905621443; i_user=100095546223382; cppo=1; xs=40%3AY2dNtgNjEBn7JA%3A2%3A1688164119%3A-1%3A-1%3A%3AAcWM69mRif3_Y1r-Gnxb_S-xJVZWjUkX7tGID4-Ds8I; fr=0UjvUaEHpaQTDOTzk.AWVuXHn6m_t2-VLERFmlNLkAojI.Bk166z.g-.AAA.0.0.Bk166z.AWXbSC5kyCg; dpr=1.75; usida=eyJ2ZXIiOjEsImlkIjoiQXJ6YWN2bzk3MnVuYyIsInRpbWUiOjE2OTE4NTcwNjF9; wd=1530x420',
        'origin': 'https://adsmanager.facebook.com',
        'referer': 'https://adsmanager.facebook.com/',

    };
    
    const url = new URL('https://adsmanager-graph.facebook.com/v17.0/act_1253594495262918/reporting');
    url.searchParams.set('access_token', token);
    url.searchParams.set('__ad_account_id', 1253594495262918);
    url.searchParams.set('_app', "ADS_MANAGER");
    url.searchParams.set('_priority', "HIGH");
    url.searchParams.set('_reqName', "adaccount/reporting");
    url.searchParams.set('_reqSrc', "AdsReportBuilderListStore");
    url.searchParams.set('attribution_windows', JSON.stringify(["default"]));
    url.searchParams.set('date_preset', "maximum");
    url.searchParams.set('dimensions', JSON.stringify(["campaign_id", "campaign_name"]));
    url.searchParams.set('method', "get");
    url.searchParams.set('metrics', JSON.stringify(["actions:link_click", "attribution_setting", "campaign_id", "conversion_annotations", "results", "spend", "delivery_info"]));
    
    const res = await fetch(url, {headers})
    // console.log(res)
    const data = await res.json()
    const campaigns = await parseMetricsToJson(data.data[0])
    return campaigns
}

export const parseMetricsToJson = async data => {
    data = data.rows
    let campaigns = []
    for(let log of data) {
        const campaign = {
            'id': log.dimensions[0].value,
            'name': log.dimensions[1].value,
            'clicks': parseInt(log.metrics[0].value),
            'messages': parseInt(log.metrics[4].results_like_metric_value.value),
            'spend': parseInt(log.metrics[5].value),
            'active': log.metrics[6].delivery_info_value.status == 'active'
        }
        Object.assign(campaign, {
            'cpc': campaign.spend / campaign.clicks,
            'cpr': campaign.spend / campaign.messages
        })
        campaigns.push(campaign)   
    }
    return campaigns
}


export const getTodayMetrics = async (token) => {
    let lastLog = await getLastLog()
    const totalMetrics = await getTotalMetrics(token)

    if(lastLog.length == 0) {
        await makeCampaignLog(totalMetrics)
        lastLog = await getLastLog()
    }

    const todayLog = totalMetrics.map( totalMetricsLog => {
        let matchedLog = lastLog.find( log => log.campaign_id == totalMetricsLog.id )
        const campaign = {
            id: totalMetricsLog.id,
            name: totalMetricsLog.name,
            active: totalMetricsLog.active,
        }

        if(matchedLog != undefined) {
            Object.assign(campaign, {
                clicks: totalMetricsLog.clicks - matchedLog.clicks,
                messages: totalMetricsLog.messages - matchedLog.messages,
                spend: totalMetricsLog.spend - matchedLog.spend,
            })
    
            Object.assign(campaign, {
                cpc: campaign.clicks > 0 ? campaign.spend / campaign.clicks : 0,
                cpr: campaign.messages > 0 ? campaign.spend / campaign.messages : 0
            })
        } else {
            Object.assign(campaign, {
                clicks: 0,
                messages: 0,
                spend: 0,
                cpc: 0,
                cpr: 0
            })
        }

        return campaign
    })

    // console.log(todayLog)

    return todayLog
} 