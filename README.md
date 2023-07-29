## What GPT CAN DO ?

### 前后端分离项目

### 前端： React+Material UI(模板来自[Creative Tim](https://www.creative-tim.com))

### 后端： SpringBoot3+Mybatis

### 数据库： Mysql

### 基本功能：

* 用户登录及注册：采用邮箱+密码方式登录
* 简单对话：与ChatGPT进行简单对话，回答用户提问，满足用户需求。
* 角色扮演对话：为ChatGPT设定角色，GPT会依据所设定角色在语气、回答内容方面产生变化
* 翻译文本：设定目标语言后输入待翻译文本后会自动输出目标语言翻译
* 用户信息监控、更改：可于用户信息界面查看用户昵称、对话统计信息、对话参数等信息，并可修改相关信息，会同步至数据库

### 使用：

#### 前端：

1. 下载源代码
2. 使用cmd进入gpt-frontend文件夹
3. `npm install`安装相关依赖
4. `npm run start`启动前端，前端默认端口为3000，访问[localhost:3000](http://localhost:3000)，默认为登录界面

#### 后端：此处以idea为例

1. 打开idea->文件->打开gpt-platform文件夹，使用maven导入项目，右键gpt-backend中pom.xml文件，选中[Run Maven]->[install]，安装依赖
2. 运行GptBackendApplication打开后端，默认端口为9999

#### 数据库：

1. 新建mysql数据库，该项目中数据库名为`gpt-database`
2. 运行sql/users.sql与sql/chats.sql生成用户表和聊天记录表

#### 注意：

* 项目结构简单，代码量不多，适用于新手上手
* GPT模型版本为gpt3.5-turbo
* 项目采用GPT key需替换为用户个人key，可在登录后进入用户信息界面修改
* 项目采用GPT api为azure提供，如需使用官方api请自行更改
* 该项目中用户聊天数据使用json格式文件保存，数据库中存储记录为文件相对路径

#### 项目部分截图：

* 用户登录
  ![用户登录](/sample_img/sign-in.png "用户登录")
* 角色扮演
  ![角色扮演](/sample_img/roleplay.png "角色扮演")
* 翻译
  ![翻译](/sample_img/translate.png "翻译")
* 用户信息
  ![用户信息](/sample_img/userinfo.png "用户信息")

##### 更多内容开发中...