export const skills = {
  'Cloud & AWS': {
    basic: ['AWS Lambda', 'DynamoDB', 'S3', 'API Gateway', 'Serverless'],
    detailed: [
      'Serverless Architecture',
      'CloudFormation',
      'IAM Policies',
      'AWS Cognito Authentication',
      'API Gateway + Lambda Integration',
      'S3 Static Hosting',
    ],
  },
  Programming: {
    basic: ['Python', 'JavaScript', 'HTML', 'CSS', 'React', 'Java'],
    detailed: [
      'Python Flask/Django',
      'JavaScript ES6+',
      'HTML5 Semantic Elements',
      'CSS3 & Flexbox/Grid',
      'React Hooks & Context',
      'Java Spring Boot',
      'Responsive Design',
    ],
  },
  Database: {
    basic: ['MySQL', 'PostgreSQL', 'DynamoDB', 'SQL', 'NoSQL'],
    detailed: [
      'MySQL Query Optimization',
      'PostgreSQL Advanced Features',
      'DynamoDB Design Patterns',
      'Complex SQL Joins',
      'NoSQL Document Design',
      'Database Indexing',
      'Data Modeling',
    ],
  },
  Tools: {
    basic: ['Git', 'GitHub', 'VS Code', 'IntelliJ IDEA', 'PyCharm'],
    detailed: [
      'Git Workflow & Branching',
      'GitHub Actions CI/CD',
      'VS Code Extensions',
      'IntelliJ IDEA Debugging',
      'PyCharm Python Development',
      'Unix/Linux CLI',
      'Docker Basics',
    ],
  },
};

export const certifications = [
  {
    name: 'Foundational C# with Microsoft',
    issuer: 'freeCodeCamp',
    status: 'completed',
    year: '2023',
    credlyImageUrl: '/Csharp certification.png',
    credlyVerifyUrl: 'https://freecodecamp.org/certification/QiLiu/foundational-c-sharp-with-microsoft',
  },
  {
    name: 'Solutions Architect Associate',
    issuer: 'AWS',
    status: 'completed',
    year: '2025',
    credlyImageUrl:
      'https://images.credly.com/size/340x340/images/0e284c3f-5164-4b21-8660-0d84737941bc/image.png',
    credlyVerifyUrl: 'https://www.credly.com/badges/4f9b68d1-68e3-480f-857c-c63d6464694f',
    credlyEmbedId: '4f9b68d1-68e3-480f-857c-c63d6464694f',
  },
  {
    name: 'Cloud Practitioner',
    issuer: 'AWS',
    status: 'completed',
    year: '2024',
    credlyImageUrl: '/img/cloud foundation.png',
    credlyVerifyUrl: '',
  },
  {
    name: 'Developer Associate',
    issuer: 'AWS',
    status: 'preparing',
    year: 'In Progress',
    credlyImageUrl: '',
    credlyVerifyUrl: '',
  },
];
