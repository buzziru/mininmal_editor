현재 3-lane-panel 레이아웃에서 패널 visibility 및 resize 동작 이후 전체 width가 부모 컨테이너를 끝까지 채우지 못하는 문제가 있습니다.

증상:

* Explorer 패널을 비활성화하면 Editor | Preview 2-column 레이아웃이 되는데, 우측에 빈 공간이 남음
* Editor/Preview 사이 resize handle을 드래그하면 실제 패널 크기뿐 아니라 우측 빈 공간 크기도 함께 변함
* 즉, 패널 width 합계가 container width와 정확히 일치하지 않음

수정 목표:

1. 모든 패널의 총 너비가 항상 부모 컨테이너 width를 정확히 채우도록 수정
2. 패널 활성/비활성 시 남는 공간 없이 즉시 재분배되도록 수정
3. resize 중에도 전체 레이아웃 width가 항상 100% 유지되도록 수정
4. 우측에 ghost whitespace / unused area 가 절대 생기지 않도록 수정
5. 최소/최대 width 제한이 있다면 이를 유지하면서 남는 공간은 flex-grow 또는 비율 계산으로 정상 분배

중점적으로 확인할 부분:

* 3-lane-panel container의 display:flex / width:100% / overflow 설정
* 각 lane의 flex-basis, flex-grow, min-width 계산
* hidden panel 제거 시 width state 재계산 여부
* resize handler가 absolute px width만 변경하고 남은 영역 계산을 누락하는지 여부
* CSS calc() 또는 inline width state가 누적 오차를 만드는지 여부
* parent container가 실제 viewport width를 모두 사용 중인지 여부

원하는 동작:

* Explorer ON:
  [Explorer][Editor][Preview] 가 빈 공간 없이 전체 width 사용
* Explorer OFF:
  [Editor][Preview] 가 자동으로 전체 width 재분배
* Resize:
  한 패널이 커지면 다른 패널이 줄어들고 전체 width 합은 항상 100%

가능하면 다음 방식으로 정리:

1. 현재 레이아웃 계산 구조 분석
2. 문제 원인 설명
3. 가장 단순하고 안정적인 수정 방식 적용
4. 수정 후 동작 흐름 설명
5. 영향받는 파일 목록 정리