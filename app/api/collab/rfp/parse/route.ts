import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { rfp_no, manual } = body;

  // 수동 입력 모드
  if (manual) {
    return NextResponse.json({ source: 'manual', data: manual });
  }

  // 나라장터 공공데이터 API
  if (!rfp_no) {
    return NextResponse.json({ error: '공고번호를 입력하세요.' }, { status: 400 });
  }

  const serviceKey = process.env.PUBLIC_DATA_API_KEY;
  if (!serviceKey) {
    return NextResponse.json({ error: 'PUBLIC_DATA_API_KEY 미설정' }, { status: 503 });
  }

  try {
    // 서비스 입찰공고 조회
    const url = new URL('https://apis.data.go.kr/1230000/BidPublicInfoService04/getBidPblancListInfoServc');
    url.searchParams.set('serviceKey', serviceKey);
    url.searchParams.set('bidNtceNo', rfp_no);
    url.searchParams.set('numOfRows', '1');
    url.searchParams.set('pageNo', '1');
    url.searchParams.set('type', 'json');

    const res = await fetch(url.toString());
    const json = await res.json();
    const item = json?.response?.body?.items?.[0];

    if (!item) {
      // 물품 구매 공고도 조회
      const url2 = new URL('https://apis.data.go.kr/1230000/BidPublicInfoService04/getBidPblancListInfoThng');
      url2.searchParams.set('serviceKey', serviceKey);
      url2.searchParams.set('bidNtceNo', rfp_no);
      url2.searchParams.set('numOfRows', '1');
      url2.searchParams.set('pageNo', '1');
      url2.searchParams.set('type', 'json');
      const res2 = await fetch(url2.toString());
      const json2 = await res2.json();
      const item2 = json2?.response?.body?.items?.[0];
      if (!item2) return NextResponse.json({ error: '공고를 찾을 수 없습니다.' }, { status: 404 });
      return NextResponse.json({ source: 'koneps', data: normalizeItem(item2) });
    }

    return NextResponse.json({ source: 'koneps', data: normalizeItem(item) });
  } catch (e) {
    console.error('나라장터 API 오류:', e);
    return NextResponse.json({ error: '나라장터 API 연결 실패' }, { status: 500 });
  }
}

function normalizeItem(item: Record<string, string>) {
  return {
    title: item.bidNtceNm || '',
    org: item.ntceInsttNm || '',
    budget: item.asignBdgtAmt || '',
    deadline: item.bidClsedt || '',
    announce_date: item.bidNtceDt || '',
    method: item.bidMthdNm || '',
    region: item.rgstTyNm || '',
    contact: item.dmndInsttNm || '',
    raw: item,
  };
}
