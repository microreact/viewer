import React from "react";
import SvgIcon from "@material-ui/core/SvgIcon";

const CircularTreeIcon = React.memo(
  (props) => (
    <SvgIcon
      {...props}
      viewBox="0 0 22 22"
    >
      <g transform="translate(657 344)">
        <g>
          <g>
            <path d="M 10 5.01653L 9 5.01653L 9 6.01653L 10 6.01653L 10 5.01653ZM 6 13.0165L 6.83205 12.4618L 6.25871 11.6018L 5.41812 12.2033L 6 13.0165ZM 2 16.0165L 1.21913 16.6412L 2 16.0165ZM 10 20.0165L 10 19.0165L 9.97764 19.0165L 9.95531 19.0175L 10 20.0165ZM 10 11.0165L 15 11.0165L 15 9.01653L 10 9.01653L 10 11.0165ZM 16 10.0165C 16 8.59154 15.6409 7.45632 15.0508 6.5712C 14.4649 5.69234 13.6908 5.11891 12.9472 4.7471C 12.2075 4.37724 11.4799 4.1973 10.9456 4.10826C 10.6762 4.06334 10.4494 4.0405 10.2861 4.02883C 10.2043 4.02299 10.1379 4.01992 10.0895 4.0183C 10.0652 4.01749 10.0455 4.01705 10.0305 4.01681C 10.023 4.01669 10.0167 4.01662 10.0116 4.01658C 10.009 4.01656 10.0068 4.01654 10.0048 4.01654C 10.0039 4.01653 10.003 4.01653 10.0022 4.01653C 10.0018 4.01653 10.0012 4.01653 10.001 4.01653C 10.0005 4.01653 10 4.01653 10 5.01653C 10 6.01653 9.99953 6.01653 9.99908 6.01652C 9.99895 6.01652 9.99852 6.01652 9.99827 6.01652C 9.99776 6.01652 9.99733 6.01652 9.99697 6.01652C 9.99626 6.01652 9.99583 6.01651 9.99569 6.01651C 9.9954 6.01651 9.99626 6.01652 9.99822 6.01655C 10.0021 6.01661 10.0104 6.01678 10.0228 6.01719C 10.0477 6.01802 10.0887 6.01983 10.1436 6.02375C 10.2537 6.03162 10.4176 6.04783 10.6169 6.08104C 11.0201 6.14825 11.5425 6.28081 12.0528 6.53595C 12.5592 6.78914 13.0351 7.15321 13.3867 7.6806C 13.7341 8.20173 14 8.94151 14 10.0165L 16 10.0165ZM 14 10.0165C 14 11.0915 13.7341 11.8313 13.3867 12.3525C 13.0351 12.8798 12.5592 13.2439 12.0528 13.4971C 11.5425 13.7522 11.0201 13.8848 10.6169 13.952C 10.4176 13.9852 10.2537 14.0014 10.1436 14.0093C 10.0887 14.0132 10.0477 14.015 10.0228 14.0159C 10.0104 14.0163 10.0021 14.0164 9.99822 14.0165C 9.99626 14.0165 9.9954 14.0165 9.99569 14.0165C 9.99583 14.0165 9.99626 14.0165 9.99697 14.0165C 9.99733 14.0165 9.99776 14.0165 9.99827 14.0165C 9.99852 14.0165 9.99895 14.0165 9.99908 14.0165C 9.99953 14.0165 10 14.0165 10 15.0165C 10 16.0165 10.0005 16.0165 10.001 16.0165C 10.0012 16.0165 10.0018 16.0165 10.0022 16.0165C 10.003 16.0165 10.0039 16.0165 10.0048 16.0165C 10.0068 16.0165 10.009 16.0165 10.0116 16.0165C 10.0167 16.0164 10.023 16.0164 10.0305 16.0162C 10.0455 16.016 10.0652 16.0156 10.0895 16.0147C 10.1379 16.0131 10.2043 16.0101 10.2861 16.0042C 10.4494 15.9926 10.6762 15.9697 10.9456 15.9248C 11.4799 15.8358 12.2075 15.6558 12.9472 15.286C 13.6908 14.9141 14.4649 14.3407 15.0508 13.4619C 15.6409 12.5767 16 11.4415 16 10.0165L 14 10.0165ZM 11 5.01653L 11 0.0165289L 9 0.0165289L 9 5.01653L 11 5.01653ZM 10 0.0165289C 10.1104 1.01041 10.1099 1.01047 10.1094 1.01052C 10.1093 1.01054 10.1088 1.01059 10.1085 1.01062C 10.108 1.01068 10.1075 1.01073 10.1071 1.01078C 10.1062 1.01087 10.1056 1.01093 10.1053 1.01097C 10.1046 1.01104 10.105 1.01099 10.1064 1.01086C 10.1092 1.0106 10.1161 1.00997 10.127 1.00915C 10.1487 1.00751 10.186 1.00507 10.2378 1.00313C 10.3413 0.999236 10.5017 0.99733 10.7087 1.00751C 11.1233 1.0279 11.7198 1.09654 12.4179 1.29199C 13.804 1.68012 15.6099 2.57232 17.2106 4.63047L 18.7894 3.40259C 16.8901 0.960739 14.696 -0.147057 12.9571 -0.633935C 12.0927 -0.875986 11.3454 -0.963594 10.8069 -0.990076C 10.5373 -1.00333 10.3189 -1.00133 10.1626 -0.99546C 10.0845 -0.992522 10.0217 -0.988608 9.9758 -0.985126C 9.95283 -0.983385 9.93404 -0.98175 9.91962 -0.980397C 9.91241 -0.979721 9.90628 -0.979114 9.90127 -0.9786C 9.89876 -0.978343 9.89653 -0.978109 9.89458 -0.9779C 9.8936 -0.977796 9.8927 -0.977698 9.89186 -0.977607C 9.89145 -0.977562 9.89087 -0.977499 9.89066 -0.977476C 9.89011 -0.977415 9.88957 -0.977355 10 0.0165289ZM 10 0.0165289C 10 -0.983471 9.99962 -0.983471 9.99922 -0.983471C 9.99906 -0.983471 9.99864 -0.98347 9.99832 -0.98347C 9.99768 -0.983469 9.99695 -0.983467 9.99614 -0.983465C 9.99451 -0.98346 9.99255 -0.983452 9.99025 -0.983439C 9.98566 -0.983413 9.97973 -0.983365 9.9725 -0.983281C 9.95804 -0.983113 9.93837 -0.982797 9.91375 -0.982209C 9.86451 -0.981033 9.7954 -0.978765 9.70854 -0.974395C 9.53493 -0.965659 9.28961 -0.948486 8.98959 -0.914681C 8.39132 -0.84727 7.566 -0.712663 6.65341 -0.442265C 4.844 0.0938563 2.58218 1.19825 1.152 3.48652L 2.848 4.54653C 3.91782 2.83482 5.656 1.93921 7.22159 1.47533C 7.9965 1.24573 8.70243 1.13033 9.21353 1.07274C 9.4682 1.04405 9.6721 1.02997 9.80904 1.02308C 9.87745 1.01964 9.92895 1.018 9.9615 1.01722C 9.97777 1.01683 9.98928 1.01666 9.99579 1.01658C 9.99905 1.01655 10.001 1.01653 10.0018 1.01653C 10.0021 1.01653 10.0021 1.01653 10.0019 1.01653C 10.0017 1.01653 10.0015 1.01653 10.0012 1.01653C 10.001 1.01653 10.0007 1.01653 10.0007 1.01653C 10.0003 1.01653 10 1.01653 10 0.0165289ZM 10 14.0165C 8.73055 14.0165 7.59558 13.6071 6.83205 12.4618L 5.16795 13.5712C 6.40442 15.4259 8.26945 16.0165 10 16.0165L 10 14.0165ZM 6 13.0165C 5.41812 12.2033 5.41809 12.2033 5.41806 12.2033C 5.41803 12.2033 5.41799 12.2033 5.41794 12.2034C 5.41783 12.2035 5.41769 12.2036 5.4175 12.2037C 5.41712 12.204 5.41657 12.2044 5.41586 12.2049C 5.41442 12.2059 5.41231 12.2074 5.40955 12.2094C 5.40402 12.2134 5.39586 12.2192 5.3852 12.2268C 5.3639 12.2421 5.33263 12.2646 5.29248 12.2934C 5.21219 12.3511 5.09637 12.4345 4.9538 12.5376C 4.66876 12.7437 4.27629 13.0289 3.84674 13.3449C 2.99584 13.9709 1.97224 14.738 1.35982 15.2483L 2.64018 16.7847C 3.19934 16.3188 4.17573 15.5858 5.03194 14.9559C 5.45594 14.644 5.8438 14.3622 6.12571 14.1583C 6.26661 14.0564 6.38091 13.9741 6.45988 13.9174C 6.49936 13.889 6.52999 13.867 6.55069 13.8521C 6.56104 13.8447 6.56891 13.8391 6.57415 13.8353C 6.57678 13.8335 6.57874 13.832 6.58004 13.8311C 6.58068 13.8307 6.58116 13.8303 6.58147 13.8301C 6.58162 13.83 6.58174 13.8299 6.5818 13.8299C 6.58184 13.8298 6.58186 13.8298 6.58188 13.8298C 6.58188 13.8298 6.58188 13.8298 6 13.0165ZM 2.78087 15.3918C 1.91608 14.3108 1.4615 12.9795 1.22855 11.873C 1.11353 11.3267 1.05614 10.8524 1.02765 10.5177C 1.01344 10.3507 1.00652 10.2196 1.00315 10.133C 1.00147 10.0897 1.00068 10.0576 1.00032 10.0378C 1.00013 10.028 1.00005 10.0211 1.00002 10.0175C 1 10.0157 0.999998 10.0147 0.999997 10.0146C 0.999997 10.0145 0.999998 10.0146 0.999998 10.0149C 0.999999 10.0151 0.999999 10.0153 0.999999 10.0156C 1 10.0157 1 10.0159 1 10.016C 1 10.0163 1 10.0165 0 10.0165C -1 10.0165 -1 10.0168 -1 10.0171C -1 10.0172 -1 10.0176 -0.999999 10.0178C -0.999999 10.0183 -0.999998 10.0188 -0.999997 10.0194C -0.999994 10.0206 -0.999989 10.022 -0.999982 10.0236C -0.999968 10.0268 -0.999942 10.0309 -0.999897 10.0358C -0.999808 10.0456 -0.999643 10.0587 -0.999339 10.075C -0.99873 10.1077 -0.997566 10.1533 -0.995341 10.2106C -0.990892 10.3252 -0.982189 10.487 -0.965148 10.6873C -0.931138 11.0869 -0.863529 11.6439 -0.72855 12.285C -0.461496 13.5535 0.0839238 15.2222 1.21913 16.6412L 2.78087 15.3918ZM 1.21913 16.6412C 3.0549 18.9359 5.24508 20.0328 6.97468 20.552C 7.83757 20.8111 8.58799 20.9273 9.12868 20.9787C 9.39943 21.0044 9.6189 21.014 9.77519 21.017C 9.85337 21.0185 9.91589 21.0184 9.96126 21.0177C 9.98396 21.0174 10.0024 21.017 10.0163 21.0166C 10.0233 21.0163 10.0292 21.0161 10.0339 21.016C 10.0363 21.0159 10.0384 21.0158 10.0402 21.0157C 10.0411 21.0157 10.0419 21.0156 10.0426 21.0156C 10.043 21.0156 10.0435 21.0156 10.0437 21.0156C 10.0442 21.0155 10.0447 21.0155 10 20.0165C 9.95531 19.0175 9.95575 19.0175 9.95617 19.0175C 9.95629 19.0175 9.9567 19.0175 9.95693 19.0175C 9.95741 19.0174 9.95781 19.0174 9.95814 19.0174C 9.95881 19.0174 9.95921 19.0174 9.95934 19.0174C 9.95959 19.0173 9.95876 19.0174 9.95687 19.0174C 9.95309 19.0175 9.94508 19.0178 9.933 19.0179C 9.90885 19.0183 9.86852 19.0185 9.81342 19.0174C 9.70313 19.0153 9.53426 19.0082 9.31797 18.9877C 8.88457 18.9465 8.26609 18.8515 7.54971 18.6365C 6.12077 18.2075 4.31095 17.3044 2.78087 15.3918L 1.21913 16.6412ZM 10 21.0165C 16.0523 21.0165 21 16.0688 21 10.0165L 19 10.0165C 19 14.9642 14.9477 19.0165 10 19.0165L 10 21.0165Z" transform="matrix(0.707107 0.707107 -0.707107 0.707107 -645.994 -347.156)"></path>
          </g>
        </g>
      </g>
    </SvgIcon>
  ),
);

CircularTreeIcon.displayName = "CircularTreeIcon";

export default CircularTreeIcon;