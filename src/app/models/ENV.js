

export const HOST = 'https://www.pixiv.net/'

export const PAGE = {
	LOGIN: `${HOST}/login.php`,
	AUTHOR: `${HOST}/member.php?id=`,
	ILLUST: `${HOST}/member_illust.php?id=`
}

export function thumbnailToOriginal(picList) {
	return picList.map((v) => {
		//循环1000000次，直接替换约为0.26s-0.32s,正则替换约为0.18s~0.2s
		//v.src.replace('c/150x150/img-master','img-original').replace('_master1200','')
		v.src = v.src.replace(/c.*img-master/, 'img-original').replace(/(_p\d+)_.*(\..*)$/, '$1$2')
		return v
	})
}

//imageUrl: 'http://i4.pixiv.net/img-original/img/2016/04/03/00/16/41/56156211_p0.png',
//thumbUrl: 'http://i4.pixiv.net/c/150x150/img-master/img/2016/04/03/00/16/41/56156211_p0_master1200.jpg',
