const RegistrationData = {
  // TC_REG_001 - Valid registration with newsletter
  validUserWithNewsletter: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+001@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    newsletter: true,
    termsAndCondition: true,
  },

  // TC_REG_002 - Valid registration without newsletter
  validUserWithoutNewsletter: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'janesmith+002@testmail.com',
    phone: '9123456780',
    password: 'Pass@5678',
    confirmPassword: 'Pass@5678',
    newsletter: false,
    termsAndCondition: true,
  },

  // TC_REG_003 & TC_REG_004 - Password toggle
  passwordToggle: {
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  },

  // TC_REG_007 - First Name below minimum (2 chars)
  firstNameBelowMin: {
    firstName: 'Jo',
    lastName: 'Doe',
    email: 'jotest+007@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_008 - Invalid email missing @
  invalidEmailNoAt: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'invalidemail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_009 - Invalid email missing domain extension
  invalidEmailNoDomain: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'user@domain',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_010 - Password mismatch
  passwordMismatch: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+010@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@9999',
    termsAndCondition: true,
  },

  // TC_REG_011 - Phone less than 10 digits
  phoneBelowMin: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+011@testmail.com',
    phone: '987654',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_012 - Already registered email
  duplicateEmail: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'existing@test.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_013 - Without T&C checkbox
  withoutTerms: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+013@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: false,
  },

  // TC_REG_014 - Phone with alphabets
  phoneWithAlphabets: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+014@testmail.com',
    phone: 'ABCD123456',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_015 - Phone with special characters
  phoneWithSpecialChars: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+015@testmail.com',
    phone: '+91-98765',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_016 - Without CAPTCHA
  withoutCaptcha: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+016@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
    skipCaptcha: true,
  },

  // TC_REG_017 - Email with leading/trailing spaces
  emailWithSpaces: {
    firstName: 'John',
    lastName: 'Doe',
    email: ' testuser@mail.com ',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_018 - Whitespace-only first name
  whitespaceFirstName: {
    firstName: '   ',
    lastName: 'Doe',
    email: 'johndoe+018@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_019 - Whitespace-only password
  whitespacePassword: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+019@testmail.com',
    phone: '9876543210',
    password: '        ',
    confirmPassword: '        ',
    termsAndCondition: true,
  },

  // TC_REG_020 - First Name exact minimum (3 chars)
  firstNameExactMin: {
    firstName: 'Tom',
    lastName: 'Doe',
    email: 'tom+020@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_021 - First Name below min (2 chars)
  firstNameBelowMinBVA: {
    firstName: 'Al',
    lastName: 'Doe',
    email: 'al+021@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_022 - First Name exact max (50 chars)
  firstNameExactMax: {
    firstName: 'Alexandraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    lastName: 'Doe',
    email: 'longname+022@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_023 - First Name above max (51 chars)
  firstNameAboveMax: {
    firstName: 'Alexandraaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa1',
    lastName: 'Doe',
    email: 'longname+023@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_024 - Last Name exact min (1 char)
  lastNameExactMin: {
    firstName: 'John',
    lastName: 'D',
    email: 'johnd+024@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_025 - Last Name exact max (50 chars)
  lastNameExactMax: {
    firstName: 'John',
    lastName: 'Doeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee',
    email: 'johnlongln+025@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_026 - Phone starting with zero
  phoneStartingWithZero: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+026@testmail.com',
    phone: '0123456789',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_027 - Phone with 11 digits
  phoneAboveMax: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+027@testmail.com',
    phone: '98765432101',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_028 - First Name with special characters
  firstNameSpecialChars: {
    firstName: '@#$%^&',
    lastName: 'Doe',
    email: 'johndoe+028@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_029 - First Name with numbers only
  firstNameNumeric: {
    firstName: '12345',
    lastName: 'Doe',
    email: 'johndoe+029@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_030 - XSS in First Name
  xssFirstName: {
    firstName: '<script>alert("XSS")</script>',
    lastName: 'Doe',
    email: 'johndoe+030@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_031 - SQL injection in Email
  sqlInjectionEmail: {
    firstName: 'John',
    lastName: 'Doe',
    email: "test@test.com' OR '1'='1",
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_032 - Double-click prevention
  doubleClickPrevention: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe+032@testmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_033 - Email with + alias
  emailWithPlusAlias: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'testuser+qa001@gmail.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
    termsAndCondition: true,
  },

  // TC_REG_034 - Form data retained after scroll
  formDataRetention: {
    firstName: 'Alice',
    lastName: 'Brown',
    email: 'alice@test.com',
    phone: '9876543210',
    password: 'Test@1234',
    confirmPassword: 'Test@1234',
  },
};

const LoginData = {
  // Valid registered credentials
  validCredentials: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: 'Password',
  },

  // TC_LOGIN_002 - Password toggle test
  passwordToggle: {
    password: 'MyPassword',
  },

  // TC_LOGIN_007 - Empty email, valid password
  emptyEmailValidPassword: {
    email: '',
    password: 'Password',
  },

  // TC_LOGIN_008 - Valid email, empty password
  validEmailEmptyPassword: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: '',
  },

  // TC_LOGIN_009 - Invalid email missing @
  invalidEmailNoAt: {
    email: 'invalidemail.com',
    password: 'Password',
  },

  // TC_LOGIN_010 - Invalid email missing domain extension
  invalidEmailNoDomain: {
    email: 'user@domain',
    password: 'Password',
  },

  // TC_LOGIN_011 - Unregistered email
  unregisteredEmail: {
    email: 'notregistered@test.com',
    password: 'Password',
  },

  // TC_LOGIN_012 - Registered email, wrong password
  wrongPassword: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: 'WrongPassword123',
  },

  // TC_LOGIN_013 - Correct email, password wrong case
  passwordWrongCase: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: 'password', // should be 'Password'
  },

  // TC_LOGIN_014 - Spaces-only password
  spacesOnlyPassword: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: '         ',
  },

  // TC_LOGIN_015 - SQL injection in email
  sqlInjectionEmail: {
    email: "' OR '1'='1",
    password: 'anypassword',
  },

  // TC_LOGIN_016 - XSS injection in email
  xssEmail: {
    email: '<script>alert("XSS")</script>',
    password: 'anypassword',
  },

  // TC_LOGIN_017 - Email with leading/trailing spaces
  emailWithSpaces: {
    email: ' sreejith.s+4@webandcrafts.com ',
    password: 'Password',
  },

  // TC_LOGIN_018 - Extremely long email (>254 chars)
  longEmail: {
    email: 'a'.repeat(250) + '@test.com',
    password: 'Password',
  },

  // TC_LOGIN_019 - Extremely long password (500+ chars)
  longPassword: {
    email: 'sreejith.s+4@webandcrafts.com',
    password: 'P'.repeat(500),
  },

  // TC_LOGIN_020 - Uppercase email
  uppercaseEmail: {
    email: 'SREEJITH.S+4@WEBANDCRAFTS.COM',
    password: 'Password',
  },
};

const PDPData = {
  // Product URL
  productUrl: '/18-k-rose-gold-mia-diamond-pendant?variant_id=45',
  productUrlNoVariant: '/18-k-rose-gold-mia-diamond-pendant',
  productUrlInvalidVariant: '/18-k-rose-gold-mia-diamond-pendant?variant_id=99999',

  // Expected product info
  productTitle: '18 K ROSE GOLD MIA DIAMOND PENDANT',
  sku: '1120821883027',
  price: '47,419',
  taxLabel: 'MRP Inclusive of all taxes',
  rating: '4.5',

  // Pincode test data
  validPincode: '682035',
  shortPincode: '6820',
  alphabeticPincode: 'ABCDEF',
  unserviceablePincode: '110001',
  sevenDigitPincode: '6820350',
  xssPincode: '<script>alert(1)</script>',

  // Newsletter test data
  validEmail: 'testuser@example.com',
  invalidEmail: 'notanemail',
  xssEmail: '<img src=x onerror=alert(1)>',

  // Login credentials for TC_PDP_044
  loginEmail: 'sreejith.s+4@webandcrafts.com',
  loginPassword: 'Password',
};

const CheckoutData = {
  // Login credentials
  email: 'sreejith.s+4@webandcrafts.com',
  password: 'Password',

  // Valid shipping address (logged-in user)
  validShipping: {
    firstName: 'Sreejith',
    lastName: 'Madavan',
    email: 'sreejith.s+4@webandcrafts.com',
    phone: '9876543210',
    address: '42 MG Road, Kakkanad',
    pinCode: '682021',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
  },

  // Guest shipping address
  guestShipping: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'johndoe@gmail.com',
    phone: '9876543210',
    address: '123 Main Street',
    pinCode: '682001',
    city: 'Kochi',
    state: 'Kerala',
    country: 'India',
  },
};

module.exports = { RegistrationData, LoginData, PDPData, CheckoutData };
