import Vue from 'vue'
import moment from 'moment'
import { mapGetters } from 'vuex'

const ossUrl = process.env.NUXT_ENV_OSS_URL;
moment.updateLocale('zh-cn', {
    meridiem: function (hour, minute, isLowercase) {
        if (hour < 9) {
            return "早上";
        } else if (hour < 11 && minute < 30) {
            return "上午";
        } else if (hour < 13 && minute < 30) {
            return "中午";
        } else if (hour < 18) {
            return "下午";
        } else {
            return "晚上";
        }
    }
});

Vue.mixin({
    filters: {
        thumbnail(object) {
            var fileId = _.get(object, 'objectId')
            var userId = _.get(object, 'user.id')

            return `${ossUrl}/users/${userId}/map/${fileId}?x-oss-process=thumbnail`
        },
        ago(time) {
            return moment.duration(moment(time).diff(moment())).locale("zh-cn").humanize(true)
        }
    }
})