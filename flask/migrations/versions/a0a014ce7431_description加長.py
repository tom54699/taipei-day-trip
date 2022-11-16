"""description加長

Revision ID: a0a014ce7431
Revises: 88b9317f3e81
Create Date: 2022-11-14 15:01:29.154320

"""
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import mysql

# revision identifiers, used by Alembic.
revision = 'a0a014ce7431'
down_revision = '88b9317f3e81'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('attraction', 'descriptions')
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('attraction', sa.Column('descriptions', mysql.VARCHAR(length=2000), nullable=True))
    # ### end Alembic commands ###
