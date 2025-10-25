// Supabase 연결 테스트 스크립트
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔍 Supabase 연결 테스트 시작...\n');

// 환경 변수 확인
console.log('1️⃣ 환경 변수 확인:');
console.log(`   URL: ${supabaseUrl ? '✅ 설정됨' : '❌ 없음'}`);
console.log(`   Key: ${supabaseKey ? '✅ 설정됨' : '❌ 없음'}\n`);

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ 환경 변수가 설정되지 않았습니다!');
  console.error('   .env.local 파일을 확인해주세요.\n');
  process.exit(1);
}

// Supabase 클라이언트 생성
const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  try {
    console.log('2️⃣ 데이터베이스 연결 테스트...');
    
    // 테이블 목록 확인
    const { data: tables, error: tablesError } = await supabase
      .from('users')
      .select('id')
      .limit(0);

    if (tablesError) {
      console.error('❌ 연결 실패:', tablesError.message);
      return false;
    }

    console.log('   ✅ 데이터베이스 연결 성공!\n');

    // 각 테이블 확인
    console.log('3️⃣ 테이블 확인:');
    
    const tablesToCheck = [
      'users',
      'philosophy_test_results',
      'posts',
      'reactions'
    ];

    for (const table of tablesToCheck) {
      const { data, error } = await supabase
        .from(table)
        .select('id')
        .limit(1);

      if (error) {
        console.log(`   ❌ ${table}: ${error.message}`);
      } else {
        console.log(`   ✅ ${table} 테이블 존재 확인`);
      }
    }

    console.log('\n4️⃣ RLS (Row Level Security) 정책 확인...');
    console.log('   (Supabase 대시보드에서 확인하세요)\n');

    console.log('✅ 모든 테스트 완료!\n');
    console.log('📝 다음 단계:');
    console.log('   1. npm run dev로 개발 서버 실행');
    console.log('   2. http://localhost:3000 에서 회원가입 테스트');
    console.log('   3. 철학 테스트 진행');
    console.log('   4. Supabase 대시보드에서 데이터 확인\n');

    return true;

  } catch (error) {
    console.error('❌ 테스트 중 오류 발생:', error.message);
    return false;
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});