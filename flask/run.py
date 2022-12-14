from api import create_app,db
app = create_app()


@app.cli.command("createdb")
def createdb():
    """ Creates db """
    print(db)
    db.create_all()

if __name__ == '__main__':
  app.run(port=3000,host="0.0.0.0")



# $env:FLASK_APP = "run.py" powershell要用這一個
# flask createdb 創立資料庫 ，要更新用migrate