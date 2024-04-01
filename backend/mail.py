import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

def send_email(to, subject, message):
    msg = MIMEMultipart()
    msg['From'] = 'agafonov.egorushka@gmail.com'
    msg['To'] = to
    msg['Subject'] = subject
    msg.attach(MIMEText(message))

    mailserver = smtplib.SMTP('smtp.gmail.com', 587)
    mailserver.ehlo()
    mailserver.starttls()
    mailserver.ehlo()
    mailserver.login('agafonov.egorushka@gmail.com', 'tnqj nlsw dmtg kejl')
    mailserver.sendmail('agafonov.egorushka@gmail.com', to, msg.as_string())
    mailserver.quit()