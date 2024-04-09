import os
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

def send_email(to, subject, message):
    msg = MIMEMultipart()
    msg['From'] = os.getenv('MAIL_LOGIN', None)
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(message))

    mailserver = smtplib.SMTP(os.getenv('MAIL_SERVER', None), os.getenv('MAIL_SERVER_PORT', None))
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login(os.getenv('MAIL_LOGIN', None), os.getenv('MAIL_PASSWORD', None))
    mailserver.sendmail(os.getenv('MAIL_LOGIN', None), to, msg.as_string())
    mailserver.quit()