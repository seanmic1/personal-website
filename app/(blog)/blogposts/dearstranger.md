---
title: 'Developing "Dear Stranger": Creating Moments of Online Connection'
date: '2023-09-28'
author: 'Sean Michael'
readtime: '4 mins'
coverimage: '/blogPics/letters.jpg'
---

In today's fast-paced digital world, genuine human connection can sometimes feel like a rare commodity. We often find ourselves immersed in the vast ocean of social media, where interactions can be shallow and fleeting. But what if there was a way to replicate those encounters with strangers that brighten our day in the real world, only in a digital space? That's precisely what "Dear Stranger" aims to do.

## The Genesis of "Dear Stranger"

The concept behind "Dear Stranger" is beautifully simple: an app where people can anonymously write and reply to letters. Imagine leaving a heartfelt note in a public place, only to have it discovered and responded to by a passerby. "Dear Stranger" captures the essence of these chance encounters, providing a platform for meaningful, anonymous interactions in the digital realm.

<figure>
    <img src="https://raw.githubusercontent.com/seanmic1/seanmic1.github.io/main/assets/png/website%20preview.png"
         alt="Dear Website Home Page">
    <figcaption>Dear Website Home Page</figcaption>
</figure>

## The Development Journey

Creating "Dear Stranger" was a labor of love that took me a month to develop, and it's an ongoing project that I'm deeply passionate about. Here's a glimpse into the technical aspects of its development:

### Technology Stack

- **Front-end Framework**: I chose [Next.js](https://nextjs.org/) as my front-end framework for its speed and flexibility.

- **CSS Component Framework**: For styling, I opted for [PandaCSS](https://pandacss.io/), a framework similar to Chakra UI. It provides a sleek and responsive design that aligns with my vision for the app.

- **Database**: To store user data and letters, I utilized [PostgreSQL](https://www.postgresql.org/), hosted on [AWS RDS](https://aws.amazon.com/rds/). This ensures the scalability and reliability of the app.

- **User Authentication**: Implementing secure user authentication is crucial, and I achieved this using the [Next Auth](https://next-auth.js.org/) package.

- **Email Communication**: To notify users, I employed the [nodemailer](https://nodemailer.com/) package for sending emails. I used a free trial of a private email service from [Namecheap](https://www.namecheap.com/) with a custom domain, "@seanml.com," to enhance the app's legitimacy.

### Ongoing Development

While the core of "Dear Stranger" is up and running, there's still much work to be done. Here are some of the exciting features I plan to implement in the future:

#### Natural Language Processing (NLP) Model

To ensure a safe and positive environment, I intend to incorporate an NLP model to filter out letters and responses containing harmful or offensive content. While the specifics of this implementation are still under consideration, it's a critical step in maintaining the app's integrity.

#### Letter Country of Origin (Perhaps?)

I wanted an option for users to add a country to their letters, to let writers and responders a better idea of who's on the other side. However, I'm on the fence with this one, as the idea of complete anonymity would be gone. Some user feedback might be needed on this one if I do get a decent userbase.

## Conclusion

"Dear Stranger" is more than just an app; it's a digital sanctuary for meaningful, anonymous connections. Its development journey has been a testament to my commitment to fostering genuine human interactions in an increasingly digital world. As I continue to refine and expand its features, I look forward to seeing how "Dear Stranger" brings people together, one anonymous letter at a time.

Stay tuned for updates on this exciting project, and in the meantime, feel free to explore the app and become a part of our growing community of strangers connecting through words.Dear Website Home Page

To try it out, visit [Dear Stranger](https://dear-stranger.vercel.app/).

---

*Note: The above article is a markdown representation. You can convert it to HTML or use a markdown editor to format and publish it on your website or blog.*

