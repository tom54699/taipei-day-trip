"""description加長

Revision ID: 88b9317f3e81
Revises: 
Create Date: 2022-11-14 15:00:21.954624

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '88b9317f3e81'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('attraction', sa.Column('descriptions', sa.String(length=2000), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('attraction', 'descriptions')
    # ### end Alembic commands ###
