/**
 * 登录用户 redis key 过期时间
 * 24h
 */
export const LOGIN_TOKEN_EXPIRESIN = 1000 * 60 * 60 * 24;

/**
 * 用户类型
 * 00系统用户,10自定义用户
 */
export const enum SYS_USER_TYPE {
  // CUSTOM = '内部用户',
  // PUBLIC = '公开',
  // PORTAL = '门户',
  SYS = '00',
  CUSTOM = '10',
}

/**
 *员工类型
 */
export const enum EMPLOYEE_USER_TYPE {
  EMPLOYEE = 'employee',
  STUDENT = 'student',
  TRAINEE = '见习',
  CONTRACTOR = '合作方',
  FREELANCER = '自由职业者',
}
